import { Resend } from 'resend';
import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, fullName } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log(`Generating verification link for: ${email}`);

        // Generate the official Firebase verification link
        const firebaseLink = await adminAuth.generateEmailVerificationLink(email, {
            url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/signin',
        });

        // Rewrite the link to point to our custom themed page
        const urlObj = new URL(firebaseLink);
        const oobCode = urlObj.searchParams.get('oobCode');
        const apiKey = urlObj.searchParams.get('apiKey');

        const customLink = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/verify-email?mode=verifyEmail&oobCode=${oobCode}&apiKey=${apiKey}`;

        console.log('Sending custom themed email via Resend...');

        const { data, error } = await resend.emails.send({
            from: 'Venture Craft Team <onboarding@resend.dev>', // You can change this after verifying venturecraft.com
            to: [email],
            subject: 'Verify your Venture Craft account',
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
            console.error('Resend error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('Full verification API error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
