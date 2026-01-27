import { Resend } from 'resend';
import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, fullName } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Get the current URL dynamically (works on localhost AND production)
        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        console.log(`Sending verification to: ${email} via ${baseUrl}`);

        // 1. Generate the official Firebase verification link
        const firebaseLink = await adminAuth.generateEmailVerificationLink(email, {
            url: `${baseUrl}/signin`,
        });

        // 2. Rewrite the link to point to our custom themed page
        const urlObj = new URL(firebaseLink);
        const oobCode = urlObj.searchParams.get('oobCode');
        const apiKey = urlObj.searchParams.get('apiKey');
        const customLink = `${baseUrl}/verify-email?mode=verifyEmail&oobCode=${oobCode}&apiKey=${apiKey}`;

        // 3. Add timestamp to subject
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const { data, error } = await resend.emails.send({
            from: 'Venture Craft Team <onboarding@resend.dev>',
            to: [email],
            subject: `Verify your Venture Craft account (${timestamp})`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #39cc89;">Welcome to Venture Craft, ${fullName}!</h2>
                    <p>We're excited to have you join our startup community. Please click the button below to verify your email address and activate your account.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${customLink}" 
                           style="background-color: #39cc89; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                           Verify My Email
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; word-break: break-all; color: #999;">${customLink}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">Venture Craft - Shaping the Future of Tech</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`✅ Verification sent to ${email} at ${timestamp}`);
        return NextResponse.json({ success: true, data });

    } catch (err: any) {
        console.error('Verification API error:', err.message);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
