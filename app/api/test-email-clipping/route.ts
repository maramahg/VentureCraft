import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
        const longStr = 'This is a test paragraph to simulate a long email. It is designed to stretch the vertical height of the container to trigger the Gmail clipping bug if it occurs on long content. ';
        const longText = Array(20).fill(longStr).join('');

        // 1. Short Email
        const htmlShort = getEmailHtml({
            title: 'Test 1: Short Email',
            content: 'This is a short email. It should not clip.',
        });

        // 2. Long Email (No Button)
        const htmlLong = getEmailHtml({
            title: 'Test 2: Long Email',
            content: longText,
        });

        // 3. Long Email (With Button)
        const htmlLongButton = getEmailHtml({
            title: 'Test 3: Long Email + Button',
            content: longText,
            button: { text: 'Test Button', url: 'https://example.com' }
        });

        // 4. Broken Broadcast Replica
        const htmlBroadcast = getEmailHtml({
            title: 'Test 4: Broadcast Replica',
            content: `
                <div style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-bottom: 32px;">
                    ${longText.replace(/\n/g, '<br/>')}
                </div>
            `,
            button: { text: 'Broadcast Button', url: 'https://example.com' }
        });

        await Promise.all([
            resend.emails.send({ from: 'Venture Craft <no-reply@kfupm-venturecraft.org>', to: [email], subject: 'Test 1: Short', html: htmlShort }),
            resend.emails.send({ from: 'Venture Craft <no-reply@kfupm-venturecraft.org>', to: [email], subject: 'Test 2: Long', html: htmlLong }),
            resend.emails.send({ from: 'Venture Craft <no-reply@kfupm-venturecraft.org>', to: [email], subject: 'Test 3: Long+Button', html: htmlLongButton }),
            resend.emails.send({ from: 'Venture Craft <no-reply@kfupm-venturecraft.org>', to: [email], subject: 'Test 4: Broadcast', html: htmlBroadcast }),
        ]);

        return NextResponse.json({ success: true, message: 'All 4 test emails sent' });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
