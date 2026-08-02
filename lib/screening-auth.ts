import { NextResponse } from 'next/server';

/**
 * Verifies the shared-secret bearer token used by the n8n Round 1 AI
 * screening workflow to call the internal screening API routes.
 *
 * Required env var: N8N_SCREENING_SECRET
 */
export function verifyScreeningSecret(request: Request): NextResponse | null {
    const secret = process.env.N8N_SCREENING_SECRET;

    if (!secret) {
        console.error('N8N_SCREENING_SECRET is not configured on the server.');
        return NextResponse.json(
            { error: 'Screening API is not configured.' },
            { status: 500 }
        );
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token || token !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return null;
}
