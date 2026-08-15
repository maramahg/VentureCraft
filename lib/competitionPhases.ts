export type PhaseStatus = 'completed' | 'active' | 'upcoming';

export interface CompetitionPhase {
  id: number;
  title: string;
  description: string;
  participantAction: string;
  status: PhaseStatus;
  dateText: string;
  icon: string; // Lucide icon component name
  startDate: string;
  endDate: string;
}

export const competitionPhases: CompetitionPhase[] = [
  {
    id: 1,
    title: 'Idea Submission',
    description:
      'Launch your journey. Submit your initial concept for review by our technical committee.',
    participantAction: 'Submit your venture application online.',
    status: 'completed',
    dateText: 'Announcing Soon',
    icon: 'Lightbulb',
    startDate: '2026-07-15T00:00:00',
    endDate: '2026-08-15T23:59:59',
  },
  {
    id: 2,
    title: 'Screening (round 1 and 2)',
    description:
      'Expert technical and business validation. Top innovators advance to the next stage of the competition.',
    participantAction: 'Await review results from the evaluation committee.',
    status: 'active',
    dateText: 'Announcing Soon',
    icon: 'Search',
    startDate: '2026-08-16T00:00:00',
    endDate: '2026-08-26T23:59:59',
  },
  {
    id: 3,
    title: 'Finalist Confirmation',
    description:
      'Confirmed finalists receive their advancement notice and prepare for the next stage.',
    participantAction: 'Confirm your participation and submit requested details.',
    status: 'upcoming',
    dateText: 'Announcing Soon',
    icon: 'BadgeCheck',
    startDate: '2026-08-30T00:00:00',
    endDate: '2026-09-05T23:59:59',
  },
  {
    id: 4,
    title: 'Online Bootcamp',
    description:
      'A virtual deep dive into startup fundamentals, IP strategy, and go-to-market planning.',
    participantAction: 'Attend workshops, connect with mentors, refine your pitch.',
    status: 'upcoming',
    dateText: 'Announcing Soon',
    icon: 'Rocket',
    startDate: '2026-09-06T00:00:00',
    endDate: '2026-09-10T23:59:59',
  },
  {
    id: 5,
    title: 'Finalist Notification and Travel',
    description:
      'Selected teams receive travel coordination details for the in person acceleration program.',
    participantAction: 'Prepare your travel visa documents and final presentation.',
    status: 'upcoming',
    dateText: 'Announcing Soon',
    icon: 'Plane',
    startDate: '2026-09-22T00:00:00',
    endDate: '2026-09-25T23:59:59',
  },
  {
    id: 6,
    title: 'In Person Acceleration',
    description:
      'Hands on mentoring and site visits to stress test your solution in a real world ecosystem.',
    participantAction: 'Iterate, refine, and prepare for Demo Day.',
    status: 'upcoming',
    dateText: 'Announcing Soon',
    icon: 'Zap',
    startDate: '2026-09-26T00:00:00',
    endDate: '2026-09-29T23:59:59',
  },
  {
    id: 7,
    title: 'Final Competition',
    description:
      'Pitch your venture to global investors and energy leaders for the grand prize and partnership deals.',
    participantAction: 'Deliver your final pitch and compete for funding.',
    status: 'upcoming',
    dateText: 'Announcing Soon',
    icon: 'Trophy',
    startDate: '2026-09-30T00:00:00',
    endDate: '2026-10-01T23:59:59',
  },
];

export const competitionJourneyStages = [
  {
    id: 'pitch',
    label: 'Pitch',
    number: '01',
    headline: 'Define Your Problem',
    description:
      'Submit your idea and articulate the problem your deep tech venture is built to solve. This is where your journey begins.',
    phases: ['Idea Submission', 'Screening'],
    image: '/images/kfupm/students.jpg',
    imageAlt: 'KFUPM student team presenting their engineering project',
    imageCaption: 'Founder Pitch',
  },
  {
    id: 'accelerate',
    label: 'Accelerate',
    number: '02',
    headline: 'Refine Your Venture',
    description:
      'Refine your venture through screening, online bootcamps, mentorship sessions, and expert feedback from KFUPM and DTV.',
    phases: ['Online Bootcamp', 'Finalist Notification'],
    image: '/images/kfupm/research-centers.png',
    imageAlt: 'KFUPM Research & Innovation mentor guiding a student in the lab',
    imageCaption: 'Mentorship & Venture Building',
  },
  {
    id: 'launch',
    label: 'Launch',
    number: '03',
    headline: 'Compete for Impact',
    description:
      'Compete in the final stage for funding, global exposure, and the support to move from research to market.',
    phases: ['Acceleration Program', 'Final Competition'],
    image: '/images/dtv/hero.png',
    imageAlt: 'Dhahran Techno Valley innovation ecosystem experience',
    imageCaption: 'Competition Experience',
  },
];
