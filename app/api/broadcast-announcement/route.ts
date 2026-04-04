import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, emails, subject, headline, message, showButton, buttonText, buttonUrl, attachments } = body;

        const recipients = emails || (email ? [email] : []);

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'At least one recipient email is required' }, { status: 400 });
        }

        // Process attachments once outside the loops
        console.log(`[EmailCenter] API Start. Recipients: ${recipients.length}, Attachments: ${attachments?.length || 0}`);

        const processedAttachments = attachments && attachments.length > 0
            ? attachments.map((att: any) => {
                const buffer = Buffer.from(att.content, 'base64');
                console.log(`[EmailCenter] Processed attachment: ${att.name}, type: ${att.type}, size: ${buffer.length} bytes`);
                return {
                    filename: att.name,
                    content: buffer,
                    contentType: att.type
                };
            })
            : undefined;

        // Resend batch sending (handles up to 100 emails per batch)
        // We'll process them in chunks of 50 to be safe and avoid rate limits
        const chunkSize = 50;
        const results = [];

        for (let i = 0; i < recipients.length; i += chunkSize) {
            const chunk = recipients.slice(i, i + chunkSize);
            console.log(`[EmailCenter] Sending chunk of ${chunk.length} emails...`);

            const batchRequests = chunk.map((toEmail: string) => {
                const htmlRow = getEmailHtml({
                    title: headline || 'Announcement',
                    previewText: subject || 'New Update from Venture Craft',
                    content: `
                        <div style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-bottom: 32px;">${(message || 'No message content provided.')
                            .replace(/\*\*([\s\S]*?)\*\*/g, '<b>$1</b>')
                            .replace(/_([\s\S]*?)_/g, '<i>$1</i>')
                            .replace(/\[mint\]([\s\S]*?)\[\/mint\]/g, '<span style="color: #39cc89; font-weight: bold;">$1</span>')
                            .replace(/\[size=(\d+)\]([\s\S]*?)\[\/size\]/g, '<span style="font-size: $1px;">$2</span>')
                            .replace(/\[align=(left|center|right|justify)\]([\s\S]*?)\[\/align\]/g, '<div style="text-align: $1;">$2</div>')
                            .replace(/\n/g, '<br/>')}</div>
                    `,
                    button: showButton !== false ? {
                        text: buttonText || 'Complete Your Application',
                        url: buttonUrl || 'https://kfupm-venturecraft.org/apply'
                    } : undefined,
                    footerMessage: 'Please note that this is an automated message and replies to this email address are not monitored.'
                });

                return {
                    from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
                    to: toEmail, // Using string instead of array for compatibility
                    subject: subject || 'New Update from Venture Craft',
                    replyTo: 'no-reply@kfupm-venturecraft.org',
                    html: htmlRow,
                    attachments: processedAttachments
                };
            });

            // Attempt to send batch
            try {
                // If only 1 recipient, use regular send for better reliability in tests
                if (batchRequests.length === 1) {
                    const response = await resend.emails.send(batchRequests[0]);
                    results.push(response);
                } else {
                    const batchResponse = await resend.batch.send(batchRequests);
                    results.push(batchResponse);
                }
                console.log(`[EmailCenter] Successfully sent chunk`);
            } catch (err: any) {
                console.error('[EmailCenter] Send error:', err.message);
                throw err;
            }
        }

        return NextResponse.json({ success: true, count: recipients.length });

    } catch (err: any) {
        console.error('API error:', err.message);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
