import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminAuth } from '@/lib/firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Generate the password reset link using Firebase Admin
        // This handles user existence check implicitly (or we can add one)
        // Note: The generatePasswordResetLink requires a valid actionCodeSettings if you want to redirect specifically
        const resetLink = await adminAuth.generatePasswordResetLink(email, {
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signin`,
        });

        // Parse the link to get the oobCode so we can use our custom reset page
        const url = new URL(resetLink);
        const oobCode = url.searchParams.get('oobCode');
        const customResetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?oobCode=${oobCode}`;

        // Send the email via Resend with the VentureCraft theme
        const { data, error } = await resend.emails.send({
            from: 'Venture Craft <onboarding@resend.dev>',
            to: email,
            subject: 'Reset Your Venture Craft Password',
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
                            <h2 style="color: #39cc89; font-size: 24px; font-weight: bold; margin-bottom: 24px; text-align: center;">Reset Your Password</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 32px; text-align: center;">
                                We received a request to reset your password for your Venture Craft account. If you didn't make this request, you can safely ignore this email.
                            </p>
                            
                            <!-- Action Button -->
                            <div style="text-align: center; margin-bottom: 32px;">
                                <a href="${customResetLink}" style="display: inline-block; background-color: #39cc89; color: #001311; padding: 18px 36px; border-radius: 14px; font-weight: bold; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(57, 204, 137, 0.2);">
                                    Reset Password
                                </a>
                            </div>

                            <p style="font-size: 14px; line-height: 1.6; color: rgba(57,204,137,0.5); text-align: center; margin-bottom: 24px;">
                                This link will expire in 1 hour for security reasons.
                            </p>

                            <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6); text-align: center;">
                                Please note that this is an automated message and replies to this email address are not monitored.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: rgba(0,0,0,0.2); padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 12px; letter-spacing: 0.5px;">
                                This is an automated email. Please do not reply directly to this message.
                            </p>
                            <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                                Venture Craft - Shaping the Future of Tech
                            </p>
                        </div>
                    </div>
                </div>
            `
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
