import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyScreeningSecret } from '@/lib/screening-auth';

/**
 * Called by the n8n Round 1 AI Screening workflow to pull a batch of
 * applications that are candidates for AI evidence extraction + rubric
 * scoring.
 *
 * IMPORTANT — known gap: the platform does not yet have an automated
 * eligibility pipeline (see AI_Screening_Doc.md Section 6). Until that
 * exists, this endpoint treats any `status: 'submitted'` application
 * without an existing `aiScreening.round1` result as a candidate. This is
 * intentionally permissive for the pilot/shadow-mode phase and MUST be
 * tightened once automated eligibility screening (Pass/Fail per
 * requirement) is implemented.
 *
 * Only fields required for evidence extraction and quality scoring are
 * returned. Identity/travel documents (`travelVisaInfo`) and the
 * eligibility proof file are never included (AI_Screening_Doc.md Section 17).
 *
 * Query params:
 *  - limit: max number of applications to return (default 10, max 50)
 *  - applicationIds: comma-separated list of specific application IDs to
 *    fetch instead of querying by status (used for pilot batches)
 */
export async function GET(request: Request) {
    const authError = verifyScreeningSecret(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const limitParam = Math.min(parseInt(searchParams.get('limit') || '10', 10) || 10, 50);
    const idsParam = searchParams.get('applicationIds');

    try {
        let docs;

        if (idsParam) {
            const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean).slice(0, 50);
            const snapshots = await Promise.all(
                ids.map((id) => adminDb.collection('applications').doc(id).get())
            );
            docs = snapshots.filter((snap) => snap.exists);
        } else {
            const snapshot = await adminDb
                .collection('applications')
                .where('status', '==', 'submitted')
                .limit(limitParam)
                .get();
            docs = snapshot.docs.filter((doc) => !doc.data()?.aiScreening?.round1);
        }

        const applications = docs.map((docSnap) => {
            const data = docSnap.data() || {};
            const materials = data.materials || {};

            return {
                applicationId: docSnap.id,
                // Best-effort version marker until real application
                // versioning (AI_Screening_Doc.md Section 15) is implemented.
                applicationVersion: data.updatedAt?.toMillis?.() ?? data.submittedAt?.toMillis?.() ?? null,
                startupName: data.startupName ?? null,
                location: data.location ?? null,
                pillar: data.pillar ?? null,
                stage: data.stage ?? null,
                isOlderThan5Years: data.isOlderThan5Years ?? null,
                teamSize: data.teamSize ?? null,
                website: data.website ?? null,
                additionalLinks: data.additionalLinks ?? null,
                audienceCategory: data.audienceCategory ?? null,
                materials: {
                    pitchDeckUrl: materials.pitchDeckUrl ?? null,
                    execSummaryUrl: materials.execSummaryUrl ?? null,
                    supportingDataUrl: materials.supportingDataUrl ?? null,
                    // eligibilityProofUrl intentionally excluded — often
                    // contains identity/registration documents.
                },
            };
        });

        // Mark picked-up applications as "processing" so a subsequent poll
        // run doesn't pick them up again while this batch is in flight.
        if (applications.length > 0) {
            const batch = adminDb.batch();
            for (const app of applications) {
                batch.set(
                    adminDb.collection('applications').doc(app.applicationId),
                    {
                        screeningJob: {
                            status: 'processing',
                            applicationVersion: app.applicationVersion,
                            updatedAt: new Date(),
                        },
                    },
                    { merge: true }
                );
            }
            await batch.commit();
        }

        return NextResponse.json({ applications, count: applications.length });
    } catch (err: any) {
        console.error('fetch-batch error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
