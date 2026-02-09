import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, status } = body;

        if (!email || !status) {
            return NextResponse.json({ error: 'Email and status are required' }, { status: 400 });
        }

        const isAccepted = status === 'accepted';
        const subject = isAccepted
            ? "Congratulations! You've been accepted to the Venture Craft Ambassadors Program"
            : "Update regarding your Ambassador Application: Venture Craft";

        const { data, error } = await resend.emails.send({
            from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
            to: [email],
            subject: subject,
            replyTo: 'no-reply@kfupm-venturecraft.org',
            html: `
                <div style="background-color: #001311; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #0c1e1c; border: 1px solid ${isAccepted ? 'rgba(57, 204, 137, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                        <!-- Header -->
                        <div style="padding: 40px 40px 20px; text-align: center;">
                            <img src="https://kfupm-venturecraft.org/logo.png" alt="Venture Craft" style="width: 180px; height: auto;" />
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 0 40px 40px;">
                            <h2 style="color: ${isAccepted ? '#39cc89' : '#ffffff'}; font-size: 24px; font-weight: bold; margin-bottom: 24px; text-align: center;">
                                ${isAccepted ? 'Welcome to the Team!' : 'Application Update'}
                            </h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.9);">Dear ${name},</p>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 32px;">
                                ${isAccepted
                    ? `Great news! We have reviewed your application and are thrilled to invite you to join the <strong>Venture Craft Ambassadors Program</strong>. Your passion for innovation and community engagement stood out to our team.`
                    : `Thank you for your interest in the Venture Craft Ambassadors Program and for taking the time to share your background with us. Our team has carefully reviewed your application.`
                }
                            </p>
                            
                            <!-- Main Message Box -->
                            <div style="background-color: ${isAccepted ? 'rgba(57, 204, 137, 0.05)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isAccepted ? 'rgba(57, 204, 137, 0.1)' : 'rgba(255,255,255,0.05)'}; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                                ${isAccepted ? `
                                    <h3 style="color: #39cc89; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 16px;">What's Next?</h3>
                                    <ul style="margin: 0; padding-left: 20px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.8;">
                                        <li>You now have active Ambassador status on the Venture Craft platform.</li>
                                        <li>Log in to your dashboard to access exclusive ambassador resources.</li>
                                        <li>We will reach out soon with details regarding our upcoming orientation and community events.</li>
                                        <li>Stay tuned for opportunities to represent Venture Craft at your institution.</li>
                                    </ul>
                                ` : `
                                    <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.8;">
                                        At this time, we will not be moving forward with your application for the Ambassadors Program. We received many high-quality submissions and had to make some very difficult choices.
                                    </p>
                                    <p style="margin: 16px 0 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.8;">
                                        We encourage you to remain a part of the Venture Craft community, participate in our challenges, and reapply for the program in future cycles.
                                    </p>
                                `}
                            </div>

                            <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                                Please note that this is an automated message regarding your application status.
                            </p>
                            
                            <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); pt-24; padding-top: 24px;">
                                <p style="font-size: 15px; color: rgba(255,255,255,0.9); margin-bottom: 4px;">Best regards,</p>
                                <p style="font-size: 16px; font-weight: bold; color: #39cc89; margin: 0;">The Venture Craft Team</p>
                            </div>
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
            `,
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
