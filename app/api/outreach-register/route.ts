import { adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, university, country, userId } = body;

        if (!email || !userId) {
            return NextResponse.json({ error: 'Email and User ID are required' }, { status: 400 });
        }

        let assignedId = 0;

        // Perform the registration transaction server-side
        await adminDb.runTransaction(async (transaction) => {
            const counterRef = adminDb.doc('counters/ambassadors');
            const counterSnap = await transaction.get(counterRef);

            let nextId = 1;
            if (counterSnap.exists) {
                const currentData = counterSnap.data();
                nextId = (Number(currentData?.lastId) || 0) + 1;
            }

            // 1. Update counter
            transaction.set(counterRef, { lastId: nextId }, { merge: true });

            // 2. Create outreach participant record
            const participantRef = adminDb.doc(`outreach_participants/${userId}`);
            transaction.set(participantRef, {
                id: userId,
                displayName: name,
                email: email,
                university: university,
                country: country,
                outreachId: nextId,
                points: 0,
                registrationDate: new Date().toISOString()
            });

            // 3. Update main user document role
            const userRef = adminDb.doc(`users/${userId}`);
            transaction.set(userRef, {
                role: 'outreach',
                outreachId: nextId
            }, { merge: true });

            assignedId = nextId;
        });

        // Send confirmation email
        try {
            const html = getEmailHtml({
                title: 'Welcome to the Outreach Challenge!',
                previewText: `You're officially an Outreach Participant! Your Venture ID is #${assignedId}.`,
                content: `
                    <p style="font-size: 16px; line-height: 1.6; color: #ffffff; margin-bottom: 24px;">Dear <strong>${name}</strong>,</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-bottom: 32px;">
                        Congratulations! You are now an official participant in the <strong>Venture Craft Outreach Challenge</strong>. We are thrilled to have you onboard!
                    </p>

                    <div style="background-color: #1a2e2b; border: 1px solid #39cc89; border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Your Unique Venture ID</p>
                        <h2 style="color: #39cc89; font-size: 32px; font-weight: bold; margin: 0;">#${assignedId}</h2>
                    </div>
                    
                    <div style="margin-bottom: 32px;">
                        <h3 style="color: #39cc89; font-size: 18px; font-weight: bold; margin-bottom: 16px;">How to Participate & Earn <span style="display: inline-block; width: 22px; height: 22px; background: #39cc89; border-radius: 50%; color: #001311; text-align: center; line-height: 22px; font-weight: 800; font-size: 14px; margin-left: 6px; vertical-align: middle; box-shadow: 0 0 10px rgba(57, 204, 137, 0.4);">$</span></h3>
                        <div style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                            <ul style="padding-left: 20px;">
                                <li style="margin-bottom: 12px;"><strong>Share Your ID:</strong> When sharing posts on social media or talking to startup founders, make sure to provide them with your Venture ID (<strong>#${assignedId}</strong>).</li>
                                <li style="margin-bottom: 12px;"><strong>Guide the Application:</strong> Instruct startups to enter your ID in the referral section when they apply at <a href="https://venturecraft.org/apply" style="color: #39cc89; text-decoration: none;">venturecraft.org/apply</a>.</li>
                                <li style="margin-bottom: 12px;"><strong>Earn Automatically:</strong> Once a startup submits their application with your ID, <strong>10 Venture Coins</strong> will be automatically added to your profile!</li>
                            </ul>
                        </div>
                    </div>

                    <div style="margin-bottom: 32px;">
                        <h3 style="color: #39cc89; font-size: 18px; font-weight: bold; margin-bottom: 16px;">Recognition & Prizes <span style="display: inline-block; width: 22px; height: 22px; background: #39cc89; border-radius: 50%; color: #001311; text-align: center; line-height: 22px; font-weight: 800; font-size: 13px; margin-left: 6px; vertical-align: middle; box-shadow: 0 0 10px rgba(57, 204, 137, 0.4);">🏆</span></h3>
                        <div style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                            <p style="margin-bottom: 12px;">The more referrals you bring in, the higher you rank on our live leaderboard:</p>
                            <ul style="padding-left: 20px;">
                                <li style="margin-bottom: 12px;"><strong>Top 3 Contributors:</strong> The three most active contributors will receive <strong>Official Recognition on our Channels</strong> (Social Media & Website).</li>
                                <li style="margin-bottom: 12px;"><strong>Season's Top Prize:</strong> The #1 contributor at the end of the season wins a <strong>Special Prize</strong> (to be announced) and a dedicated feature.</li>
                            </ul>
                        </div>
                    </div>

                    <p style="margin-top: 40px; border-top: 1px solid #1a3a36; padding-top: 24px;">
                        <span style="font-size: 15px; color: #ffffff; display: block; margin-bottom: 4px;">Best regards,</span>
                        <span style="font-size: 16px; font-weight: bold; color: #39cc89;">The Venture Craft Team</span>
                    </p>
                `,
                footerMessage: 'Please note that this is an automated message and replies to this email address are not monitored.'
            });

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Connection': 'close'
                },
                body: JSON.stringify({
                    from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
                    to: [email],
                    subject: `Welcome to the Outreach Challenge: Venture Craft ID #${assignedId}`,
                    replyTo: 'no-reply@kfupm-venturecraft.org',
                    html: html,
                }),
                cache: 'no-store',
                keepalive: false
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('RESEND_FETCH_ERROR:', errorData);
            }
        } catch (emailErr) {
            console.error('Email error (handled):', emailErr);
            // Don't fail the whole registration if email fails
        }

        return NextResponse.json({
            success: true,
            outreachId: assignedId
        });

    } catch (err: any) {
        console.error('API error:', err.message);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
