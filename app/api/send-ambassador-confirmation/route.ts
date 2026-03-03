import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const html = getEmailHtml({
            title: 'Application Successfully Received',
            previewText: `Confirmed! We've received your application for the Venture Craft Ambassadors Program.`,
            content: `
                <p style="font-size: 16px; line-height: 1.6; color: #ffffff; margin-bottom: 24px;">Dear ${name},</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-bottom: 32px;">
                    Thank you for applying to the <strong>Venture Craft Ambassadors Program</strong>. We are pleased to confirm that we have received your application.
                </p>
                
                <div style="background-color: #1a2e2b; border: 1px solid #39cc89; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h3 style="color: #39cc89; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 16px;">Next Steps</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 15px; line-height: 1.8;">
                        <li>Our team will review your academic background and social media profile.</li>
                        <li>We seek passionate individuals who are committed to driving innovation within their communities.</li>
                        <li>You will receive an update regarding your application status via email.</li>
                        <li>In the meantime, feel free to explore our platform and follow our latest updates.</li>
                    </ul>
                </div>

                <p style="margin-top: 40px; border-top: 1px solid #1a3a36; padding-top: 24px;">
                    <span style="font-size: 15px; color: #ffffff; display: block; margin-bottom: 4px;">Best regards,</span>
                    <span style="font-size: 16px; font-weight: bold; color: #39cc89;">The Venture Craft Team</span>
                </p>
            `,
            footerMessage: 'Please note that this is an automated message and replies to this email address are not monitored.'
        });

        const { data, error } = await resend.emails.send({
            from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
            to: [email],
            subject: `Ambassador Application Received: Venture Craft Program`,
            replyTo: 'no-reply@kfupm-venturecraft.org',
            html: html,
        });

        if (error) {
            console.error('Resend error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (err: any) {
        console.error('API error:', err.message);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
