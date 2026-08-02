import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyScreeningSecret } from '@/lib/screening-auth';
import {
    computeRound1Score,
    QuestionId,
    QuestionScores,
    ROUND1_RUBRIC_VERSION,
} from '@/lib/round1-rubric';

/**
 * Called by the n8n Round 1 AI Screening workflow to submit the result of
 * evidence extraction + rubric scoring for a single application.
 *
 * This endpoint is the ONLY place that writes AI results, and it writes
 * exclusively to `aiScreening.round1` — it never touches `screening.round1`,
 * which holds the judges' own manual scores (legacy rubric). This keeps the
 * AI recommendation and any human decision permanently distinguishable
 * (AI_Screening_Doc.md Section 22).
 *
 * The final weighted score is ALWAYS recomputed server-side from the raw
 * 0-4 question scores using the official rubric formulas — the model's own
 * math (if any) is never trusted.
 *
 * Expected body:
 * {
 *   applicationId: string,
 *   applicationVersion: number | null,
 *   evidence: object,            // Stage A structured evidence extraction
 *   questionScores: {            // Stage B — one run, already reconciled
 *     [questionId]: number       // 0-4
 *   },
 *   consistency: {
 *     run1: { [questionId]: number },
 *     run2: { [questionId]: number },
 *     maxDivergence: number
 *   },
 *   confidence: number,          // 0-1, model's self-reported confidence
 *   modelInfo: { provider: string, model: string, promptVersion: string },
 *   extractionQuality: {
 *     pitchDeckExtracted: boolean,
 *     execSummaryExtracted: boolean,
 *     supportingDataExtracted: boolean
 *   },
 *   additionalFlags?: string[]   // e.g. 'possible_prompt_injection'
 * }
 */
export async function POST(request: Request) {
    const authError = verifyScreeningSecret(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const {
            applicationId,
            applicationVersion,
            evidence,
            questionScores,
            consistency,
            confidence,
            modelInfo,
            extractionQuality,
            additionalFlags = [],
        } = body;

        if (!applicationId || typeof applicationId !== 'string') {
            return NextResponse.json({ error: 'applicationId is required.' }, { status: 400 });
        }
        if (!questionScores || typeof questionScores !== 'object') {
            return NextResponse.json({ error: 'questionScores is required.' }, { status: 400 });
        }

        const appRef = adminDb.collection('applications').doc(applicationId);
        const appSnap = await appRef.get();
        if (!appSnap.exists) {
            return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
        }

        // Do not overwrite a result the committee has already approved/locked.
        const existingAi = appSnap.data()?.aiScreening?.round1;
        if (existingAi?.committeeApproved) {
            return NextResponse.json(
                { error: 'This application\'s AI result has already been committee-approved and is locked.' },
                { status: 409 }
            );
        }

        let scoring;
        try {
            scoring = computeRound1Score(questionScores as QuestionScores);
        } catch (validationError: any) {
            // Malformed AI output — never silently accept it. Route to
            // manual review instead of failing the whole job silently.
            await appRef.set(
                {
                    screeningJob: { status: 'failed', updatedAt: new Date() },
                    aiScreening: {
                        round1: {
                            error: validationError.message,
                            rawQuestionScores: questionScores,
                            modelInfo: modelInfo ?? null,
                            evaluatedAt: new Date(),
                        },
                    },
                },
                { merge: true }
            );
            return NextResponse.json({ error: validationError.message }, { status: 422 });
        }

        const flags: string[] = [...additionalFlags];

        const maxDivergence = consistency?.maxDivergence ?? 0;
        if (maxDivergence >= 1) flags.push('low_repeat_run_stability');
        if (typeof confidence === 'number' && confidence < 0.6) flags.push('low_confidence');
        if (extractionQuality?.pitchDeckExtracted === false) flags.push('pitch_deck_extraction_failed');
        if (extractionQuality?.execSummaryExtracted === false) flags.push('exec_summary_extraction_failed');

        for (const t of scoring.minThresholdCriteria) {
            if (t.belowThreshold) flags.push(`below_min_threshold:${t.id}`);
        }

        const requiresManualReview = flags.length > 0;

        const aiResult = {
            rubricVersion: ROUND1_RUBRIC_VERSION,
            evidence: evidence ?? null,
            questionScores,
            consistency: consistency ?? null,
            criteria: scoring.criteria,
            finalScore: scoring.finalScore,
            minThresholdCriteria: scoring.minThresholdCriteria,
            confidence: confidence ?? null,
            flags,
            extractionQuality: extractionQuality ?? null,
            modelInfo: modelInfo ?? null,
            applicationVersion: applicationVersion ?? null,
            evaluatedAt: new Date(),
            committeeApproved: false,
        };

        await appRef.set(
            {
                screeningJob: {
                    status: requiresManualReview ? 'manual_review' : 'completed',
                    applicationVersion: applicationVersion ?? null,
                    updatedAt: new Date(),
                },
                aiScreening: {
                    round1: aiResult,
                },
            },
            { merge: true }
        );

        return NextResponse.json({
            success: true,
            applicationId,
            finalScore: scoring.finalScore,
            requiresManualReview,
            flags,
        });
    } catch (err: any) {
        console.error('round1-result error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
