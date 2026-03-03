import { Resend } from 'resend';
import { NextResponse } from 'next/server';

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
            const batchRequests = chunk.map((toEmail: string) => ({
                from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
                to: [toEmail],
                subject: subject || '🚀 Deadline Extended: Join the Venture Craft Challenge',
                replyTo: 'no-reply@kfupm-venturecraft.org',
                html: `
                    <div style="background-color: #001311; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #0c1e1c; border: 1px solid rgba(57, 204, 137, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                            <!-- Header -->
                            <div style="padding: 40px 40px 20px; text-align: center;">
                                <img src="https://kfupm-venturecraft.org/logo.png" alt="Venture Craft" style="width: 180px; height: auto;" />
                            </div>
                            
                            <!-- Content -->
                            <div style="padding: 0 40px 40px;">
                                <h2 style="color: #39cc89; font-size: 24px; font-weight: bold; margin-bottom: 24px; text-align: center;">${headline || 'Announcement'}</h2>
                                
                                <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 32px; white-space: pre-wrap;">${(message || 'No message content provided.')
                        .replace(/\*\*([\s\S]*?)\*\*/g, '<b>$1</b>')
                        .replace(/_([\s\S]*?)_/g, '<i>$1</i>')
                        .replace(/\[mint\]([\s\S]*?)\[\/mint\]/g, '<span style="color: #39cc89; font-weight: bold;">$1</span>')
                        .replace(/\n/g, '<br/>')}</p>
                                
                                <!-- Action Box -->
                                ${showButton !== false ? `
                                <div style="background-color: rgba(57, 204, 137, 0.05); border: 1px solid rgba(57, 204, 137, 0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
                                    <a href="${buttonUrl || 'https://kfupm-venturecraft.org/apply'}" style="display: inline-block; background-color: #39cc89; color: #001311; padding: 12px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">${buttonText || 'Complete Your Application'}</a>
                                </div>
                                ` : ''}

                                <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                                    Please note that this is an automated message and replies to this email address are not monitored.
                                </p>
                                
                                <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); pt-24; padding-top: 24px;">
                                    <p style="font-size: 15px; color: rgba(255,255,255,0.9); margin-bottom: 4px;">Best regards,</p>
                                    <p style="font-size: 16px; font-weight: bold; color: #39cc89; margin: 0;">The Venture Craft Team</p>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: rgba(0,0,0,0.2); padding: 32px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                                <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 12px; letter-spacing: 0.5px;">
                                    This is an automated email. Please do not reply directly to this message.
                                </p>
                                <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                                    Venture Craft - Shaping the Future of Tech
                                </p>
                                <div style="display: none !important; color: transparent; opacity: 0; font-size: 0; line-height: 0; height: 0; overflow: hidden;">
                                    ${Math.random().toString(36).substring(7)} - ${Date.now()}
                                </div>
                            </div>
                        </div>
                    </div>
                `,
            }));

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
