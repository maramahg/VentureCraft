import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, status, location, ambassadorType: manualType } = body;

        if (!email || !status) {
            return NextResponse.json({ error: 'Email and status are required' }, { status: 400 });
        }

        const isAccepted = status === 'accepted';

        // Use manual override if provided, otherwise fallback to location-based logic
        let isLocal = location?.toLowerCase().includes('saudi') || location?.toLowerCase() === 'sa';
        if (manualType === 'local') isLocal = true;
        if (manualType === 'global') isLocal = false;

        const ambassadorType = isLocal ? 'Local Ambassador' : 'Global Ambassador';
        const whatsappLink = isLocal
            ? 'https://chat.whatsapp.com/DBr16wI3id909bnqMtMFPP?mode=gi_t'
            : 'https://chat.whatsapp.com/E5bMs10LbpLAWXGOXVfY6S?mode=gi_t';

        // Personalized Card Logic (Inline CID Attachment for 100% reliability)
        let cardImageHtml = '';
        let attachments: any[] = [];

        if (isAccepted) {
            try {
                // Determine the base URL dynamically
                const host = request.headers.get('host');
                const protocol = host?.includes('localhost') ? 'http' : 'https';
                const baseUrl = `${protocol}://${host}`;

                // Fetch the personalized image server-side
                const encodedName = encodeURIComponent(name);
                const cardImageUrl = `${baseUrl}/api/ambassador-card-image?name=${encodedName}`;

                const response = await fetch(cardImageUrl);
                if (response.ok) {
                    const imageBuffer = await response.arrayBuffer();
                    const base64Content = Buffer.from(imageBuffer).toString('base64');

                    // Add as attachment with CID
                    attachments.push({
                        filename: 'ambassador-card.png',
                        content: base64Content,
                        content_type: 'image/png',
                        disposition: 'inline',
                        content_id: 'ambassador-card'
                    });

                    cardImageHtml = `
                        <div style="margin-bottom: 32px; text-align: center;">
                            <img src="cid:ambassador-card" alt="" style="width: 100%; max-width: 600px; height: auto; border-radius: 20px; display: block; margin: 0 auto;" />
                        </div>
                    `;
                }
            } catch (fetchError) {
                console.error('Failed to fetch personalized card for attachment:', fetchError);
                // No fallback needed here, cardImageHtml will remain empty
            }
        }

        const subject = isAccepted
            ? `Congratulations! You've been accepted as a ${ambassadorType}`
            : "Update regarding your Ambassador Application: Venture Craft";

        const content = `
            <p style="font-size: 16px; line-height: 1.6; color: #ffffff; margin-bottom: 24px;">Dear ${name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-bottom: 32px;">
                 ${isAccepted
                ? `Congratulations! We have carefully reviewed your application, and we are thrilled to officially invite you to join the <strong>Venture Craft Ambassadors Program</strong> as a <strong>${ambassadorType}</strong>. Your dedication to fostering innovation and your vision for community engagement stood out to our team.`
                : `Thank you so much for your interest in the Venture Craft Ambassadors Program and for the effort you put into your application. It was a pleasure to learn about your background, goals, and your vision for the deep tech ecosystem.`
            }
            </p>
            
            <div style="background-color: ${isAccepted ? '#1a2e2b' : '#161d1c'}; border: 1px solid ${isAccepted ? '#39cc89' : '#2c4a45'}; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                ${isAccepted ? `
                    <h3 style="color: #39cc89; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 16px;">Next Steps</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 15px; line-height: 1.8;">
                        <li>You now have active Ambassador status on the Venture Craft platform.</li>
                        <li><strong>Join the Community:</strong> Please join our official WhatsApp community and your dedicated ambassador group via the link below:
                            <div style="margin-top: 20px; margin-bottom: 20px; text-align: center;">
                                <a href="${whatsappLink}" style="background-color: #39cc89; color: #001311; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Join WhatsApp Group</a>
                            </div>
                        </li>
                        <li>Further details regarding orientation and upcoming tasks will be shared directly within the WhatsApp group.</li>
                    </ul>
                ` : `
                    <p style="margin: 0; color: #94a3b8; font-size: 15px; line-height: 1.8;">
                        While our team was genuinely impressed by your profile, we are unfortunately unable to offer you a position in the Ambassadors Program at this time. This was a very difficult choice, as we received many exceptional applications this cycle.
                    </p>
                    <p style="margin: 16px 0 0; color: #94a3b8; font-size: 15px; line-height: 1.8;">
                        Please know that this decision doesn't reflect your potential as a future leader. We truly value your enthusiasm and would love for you to stay involved with Venture Craft.
                    </p>
                `}
            </div>
            
            ${cardImageHtml}

            <p style="margin-top: 40px; border-top: 1px solid #1a3a36; padding-top: 24px;">
                <span style="font-size: 15px; color: #ffffff; display: block; margin-bottom: 4px;">Best regards,</span>
                <span style="font-size: 16px; font-weight: bold; color: #39cc89;">The Venture Craft Team</span>
            </p>
        `;

        const html = getEmailHtml({
            title: isAccepted ? `Welcome to the Team, ${ambassadorType}!` : 'Application Update',
            previewText: isAccepted ? `Congratulations! You've been accepted as a ${ambassadorType}.` : 'Thank you for your application to Venture Craft.',
            content: content,
            footerMessage: 'Please note that this is an automated message and replies to this email address are not monitored.'
        });

        const { data, error } = await resend.emails.send({
            from: 'Venture Craft <no-reply@kfupm-venturecraft.org>',
            to: [email],
            subject: subject,
            replyTo: 'no-reply@kfupm-venturecraft.org',
            attachments: attachments,
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
