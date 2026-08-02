/**
 * Official KFUPM Venture Craft Round 1 (AI Evaluation) rubric.
 *
 * Source of truth: "KFUPM Venture Craft — Evaluation & Selection Manual 2026,
 * Version 2.0", Section 5.4–5.10. Distinct from the legacy `screening.round1`
 * rubric still used by judges in app/admin/page.tsx (Problem & Market Clarity /
 * Solution & Innovation / Early Business Logic / Communication & Conviction),
 * which this AI screening workflow does NOT read or write.
 *
 * The AI is only permitted to produce a 0–4 score per assessment question.
 * All weighted-sum math is performed here, server-side — never trust
 * criterion or final totals computed by the model itself.
 */

export type QuestionId =
    | 'problem_defined'
    | 'problem_significance'
    | 'problem_long_term_value'
    | 'tech_differentiation'
    | 'tech_approach'
    | 'tech_evidence_defensibility'
    | 'evidence_appropriate'
    | 'evidence_feasibility'
    | 'evidence_stage_support'
    | 'market_customer'
    | 'market_understanding'
    | 'market_customer_validation'
    | 'market_commercialization'
    | 'quality_complete'
    | 'quality_consistency'
    | 'quality_evidence_support';

export interface RubricQuestion {
    id: QuestionId;
    text: string;
    weight: number; // fraction of the criterion, sums to 1 within a criterion
}

export interface RubricCriterion {
    id: string;
    name: string;
    weight: number; // fraction of the final score, sums to 1 across all criteria
    questions: RubricQuestion[];
}

export const ROUND1_RUBRIC_VERSION = '2026-v2.0';

export const ROUND1_RUBRIC: RubricCriterion[] = [
    {
        id: 'problem_significance',
        name: 'Problem Significance & Strategic Impact',
        weight: 0.15,
        questions: [
            { id: 'problem_defined', text: 'Is the problem clearly defined and supported by evidence?', weight: 0.40 },
            { id: 'problem_significance', text: 'How significant is the problem for the intended users or industry?', weight: 0.35 },
            { id: 'problem_long_term_value', text: 'Does solving the problem create meaningful long-term value?', weight: 0.25 },
        ],
    },
    {
        id: 'technology_differentiation',
        name: 'Technology Explanation & Differentiation',
        weight: 0.25,
        questions: [
            { id: 'tech_differentiation', text: 'Has the team clearly explained how the technology differs from existing alternatives?', weight: 0.40 },
            { id: 'tech_approach', text: 'Has the team adequately explained the underlying scientific or engineering approach?', weight: 0.35 },
            { id: 'tech_evidence_defensibility', text: 'Has the team provided sufficient evidence supporting the claimed technological differentiation and defensibility?', weight: 0.25 },
        ],
    },
    {
        id: 'technical_evidence',
        name: 'Technical Evidence & Validation',
        weight: 0.25,
        questions: [
            { id: 'evidence_appropriate', text: 'Has the team provided appropriate technical evidence supporting the proposed solution?', weight: 0.45 },
            { id: 'evidence_feasibility', text: 'Does the submitted evidence reasonably support the claimed feasibility?', weight: 0.30 },
            { id: 'evidence_stage_support', text: 'Is the claimed development stage supported by the evidence?', weight: 0.25 },
        ],
    },
    {
        id: 'market_opportunity',
        name: 'Market Opportunity & Commercial Potential',
        weight: 0.20,
        questions: [
            { id: 'market_customer', text: 'Has the team clearly identified and understood its target customer?', weight: 0.20 },
            { id: 'market_understanding', text: 'Does the startup demonstrate a credible understanding of its market opportunity?', weight: 0.30 },
            { id: 'market_customer_validation', text: 'Has the team demonstrated evidence of customer validation?', weight: 0.30 },
            { id: 'market_commercialization', text: 'Is there a credible commercialization pathway?', weight: 0.20 },
        ],
    },
    {
        id: 'application_quality',
        name: 'Application Quality & Consistency',
        weight: 0.15,
        questions: [
            { id: 'quality_complete', text: 'Is the application complete and logically structured?', weight: 0.40 },
            { id: 'quality_consistency', text: 'Are technical and commercial claims communicated clearly and consistently?', weight: 0.35 },
            { id: 'quality_evidence_support', text: 'Does the submitted evidence sufficiently support the key claims?', weight: 0.25 },
        ],
    },
];

export type QuestionScores = Partial<Record<QuestionId, number>>;

export interface CriterionResult {
    id: string;
    name: string;
    weight: number;
    score: number; // 0-4, weighted average of its questions
    weightedContribution: number; // score/4 * weight * 100
}

export interface ScoringResult {
    criteria: CriterionResult[];
    finalScore: number; // 0-100
    minThresholdCriteria: { id: string; score: number; belowThreshold: boolean }[];
}

/**
 * Minimum quality threshold (0-4 scale) referenced in manual Section 9.4.
 *
 * NOTE: The manual states this threshold applies to "Technology
 * Differentiation & Innovation" and "Technical Credibility & Development" —
 * names used for the ROUND 2 rubric (Section 6.6/6.7), not the Round 1
 * names used here. Whether this threshold gates Round 1 at all, and which
 * Round 1 criteria it maps to, is an open leadership decision
 * (AI_Screening_Doc.md Section 25, questions 8–9).
 *
 * Until confirmed, this is computed as INFORMATIONAL ONLY and must be
 * surfaced as a manual-review flag — it must never auto-disqualify an
 * application in Round 1.
 */
export const MIN_QUALITY_THRESHOLD = 2.0;
export const MIN_THRESHOLD_CRITERION_IDS = ['technology_differentiation', 'technical_evidence'];

/**
 * Validates that every question required by the rubric has a numeric
 * score in [0, 4]. Throws if the AI output does not match the required
 * schema — per the manual's requirement to reject malformed AI output
 * rather than silently accept it.
 */
export function validateQuestionScores(scores: QuestionScores): void {
    for (const criterion of ROUND1_RUBRIC) {
        for (const question of criterion.questions) {
            const value = scores[question.id];
            if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || value > 4) {
                throw new Error(
                    `Invalid or missing score for question "${question.id}" (${question.text}). Expected a number between 0 and 4.`
                );
            }
        }
    }
}

/**
 * Computes weighted criterion scores and the final 0-100 Round 1 score
 * using the official manual formulas. This must be the only place the
 * final score is calculated — AI output is never trusted for totals.
 */
export function computeRound1Score(scores: QuestionScores): ScoringResult {
    validateQuestionScores(scores);

    const criteria: CriterionResult[] = ROUND1_RUBRIC.map((criterion) => {
        const rawScore = criterion.questions.reduce((sum, q) => {
            return sum + (scores[q.id] as number) * q.weight;
        }, 0);

        return {
            id: criterion.id,
            name: criterion.name,
            weight: criterion.weight,
            score: Number(rawScore.toFixed(4)),
            weightedContribution: Number(((rawScore / 4) * criterion.weight * 100).toFixed(4)),
        };
    });

    const finalScore = Number(
        criteria.reduce((sum, c) => sum + c.weightedContribution, 0).toFixed(2)
    );

    const minThresholdCriteria = criteria
        .filter((c) => MIN_THRESHOLD_CRITERION_IDS.includes(c.id))
        .map((c) => ({
            id: c.id,
            score: c.score,
            belowThreshold: c.score < MIN_QUALITY_THRESHOLD,
        }));

    return { criteria, finalScore, minThresholdCriteria };
}
