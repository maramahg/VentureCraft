import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminAuth } from '@/lib/firebase-admin';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Determine the base URL dynamically
        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

        // Generate the password reset link using Firebase Admin
        const resetLink = await adminAuth.generatePasswordResetLink(email, {
            url: `${baseUrl}/signin`,
        });

        // Parse the link to get the oobCode so we can use our custom reset page
        const url = new URL(resetLink);
        const oobCode = url.searchParams.get('oobCode');
        const customResetLink = `${baseUrl}/reset-password?oobCode=${oobCode}`;

        const html = getEmailHtml({
            title: 'Reset Your Password',
            previewText: 'We received a request to reset your password for your Venture Craft account.',
            content: `
                <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-bottom: 32px; text-align: center;">
                    We received a request to reset your password for your Venture Craft account. If you didn't make this request, you can safely ignore this email.
                </p>
                
                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${customResetLink}" style="display: inline-block; background-color: #39cc89; color: #001311; padding: 18px 36px; border-radius: 14px; font-weight: bold; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(57, 204, 137, 0.2);">
                        Reset Password
                    </a>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #2c4a45; text-align: center; margin-bottom: 24px;">
                    This link will expire in 1 hour for security reasons.
                </p>

                <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; text-align: center;">
                    Please note that this is an automated message and replies to this email address are not monitored.
                </p>
            `,
            footerMessage: 'This is an automated email. Please do not reply directly to this message.'
        });

        // Send the email via Resend with the VentureCraft theme
        const { data, error } = await resend.emails.send({
            from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
            to: email,
            subject: 'Reset Your Venture Craft Password',
            replyTo: 'no-reply@kfupm-venturecraft.org',
            html: html
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Password Reset Error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
