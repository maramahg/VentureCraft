import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, emails, subject, headline, message, showButton, buttonText, buttonUrl } = body;

        const recipients = emails || (email ? [email] : []);

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'At least one recipient email is required' }, { status: 400 });
        }

        // Resend batch sending (handles up to 100 emails per batch)
        // We'll process them in chunks of 50 to be safe and avoid rate limits
        const chunkSize = 50;
        const results = [];

        for (let i = 0; i < recipients.length; i += chunkSize) {
            const chunk = recipients.slice(i, i + chunkSize);
            const batchRequests = chunk.map((toEmail: string) => {
                const htmlRow = getEmailHtml({
                    title: headline || 'Announcement',
                    previewText: subject || 'New Update from Venture Craft',
                    content: `
                        <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0 !important; margin-bottom: 32px; white-space: pre-wrap;">${(message || 'No message content provided.')
                            .replace(/\*\*([\s\S]*?)\*\*/g, '<b>$1</b>')
                            .replace(/_([\s\S]*?)_/g, '<i>$1</i>')
                            .replace(/\[mint\]([\s\S]*?)\[\/mint\]/g, '<span style="color: #39cc89 !important; font-weight: bold;">$1</span>')
                            .replace(/\n/g, '<br/>')}</p>
                    `,
                    button: showButton !== false ? {
                        text: buttonText || 'Complete Your Application',
                        url: buttonUrl || 'https://kfupm-venturecraft.org/apply'
                    } : undefined,
                    footerMessage: 'Please note that this is an automated message and replies to this email address are not monitored.'
                });

                return {
                    from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
                    to: [toEmail],
                    subject: subject || '🚀 Deadline Extended: Join the Venture Craft Challenge',
                    replyTo: 'no-reply@kfupm-venturecraft.org',
                    html: htmlRow
                };
            });

            // Attempt to send batch
            try {
                // Check if batch is supported, if not fall back to Promise.all
                const batchResponse = await (resend.batch ? resend.batch.send(batchRequests) : Promise.all(batchRequests.map((req: any) => resend.emails.send(req))));
                results.push(batchResponse);
            } catch (err: any) {
                console.error('Batch send error:', err.message);
                throw err;
            }
        }

        return NextResponse.json({ success: true, count: recipients.length });

    } catch (err: any) {
        console.error('API error:', err.message);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
