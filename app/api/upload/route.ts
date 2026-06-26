import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import {
    MAX_VISA_DOCUMENT_SIZE_BYTES,
    VISA_DOCUMENT_CONTENT_TYPES,
    VISA_DOCUMENT_UPLOAD_SEGMENT
} from '@/lib/travelVisa';

const DEFAULT_ALLOWED_UPLOAD_CONTENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/webp'
];

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Authenticate the user here if needed
                // const user = await auth(request);
                // if (!user) throw new Error('Unauthorized');
                const isVisaDocument = pathname.includes(VISA_DOCUMENT_UPLOAD_SEGMENT);

                return {
                    allowedContentTypes: isVisaDocument
                        ? VISA_DOCUMENT_CONTENT_TYPES
                        : DEFAULT_ALLOWED_UPLOAD_CONTENT_TYPES,
                    ...(isVisaDocument ? { maximumSizeInBytes: MAX_VISA_DOCUMENT_SIZE_BYTES } : {}),
                    tokenPayload: JSON.stringify({
                        // optional, sent to your server on upload completion
                        // userId: user.id,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Warning: This is async and not awaited by the client
                console.log('blob uploaded', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
