import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Venture Craft <onboarding@resend.dev>',
            to: [email],
            subject: `Ambassador Application Received: Venture Craft Program`,
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
                            <h2 style="color: #39cc89; font-size: 24px; font-weight: bold; margin-bottom: 24px; text-align: center;">Application Successfully Received</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.9);">Dear ${name},</p>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 32px;">
                                Thank you for applying to the <strong>Venture Craft Ambassadors Program</strong>. We are pleased to confirm that we have received your application.
                            </p>
                            
                            <!-- Next Steps Box -->
                            <div style="background-color: rgba(57, 204, 137, 0.05); border: 1px solid rgba(57, 204, 137, 0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                                <h3 style="color: #39cc89; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 16px;">Next Steps</h3>
                                <ul style="margin: 0; padding-left: 20px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.8;">
                                    <li>Our team will review your academic background and social media profile.</li>
                                    <li>We seek passionate individuals who are committed to driving innovation within their communities.</li>
                                    <li>You will receive an update regarding your application status via email.</li>
                                    <li>In the meantime, feel free to explore our platform and follow our latest updates.</li>
                                </ul>
                            </div>

                            <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                                Please note that this is an automated message and replies to this email address are not monitored.
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
