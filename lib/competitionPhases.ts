export type PhaseStatus = 'completed' | 'active' | 'upcoming';

export interface CompetitionPhase {
  id: number;
  title: string;
  description: string;
  participantAction: string;
  status: PhaseStatus;
  dateText: string;
  icon: string; // emoji/icon identifier
}

export const competitionPhases: CompetitionPhase[] = [
  {
    id: 1,
    title: 'Idea Submission',
    description:
      'Submit your startup idea and define the problem your deep-tech venture is built to solve. Applications are evaluated on innovation, impact, and scientific rigor.',
    participantAction: 'Submit your venture application online.',
    status: 'completed',
    dateText: 'Applications closed for this cycle',
    icon: '💡',
  },
  {
    id: 2,
    title: 'Screening',
    description:
      'Expert reviewers evaluate submitted ideas against VentureCraft criteria — scientific foundation, market potential, team capability, and deep-tech relevance.',
    participantAction: 'Await review results from the evaluation committee.',
    status: 'active',
    dateText: 'Currently in progress',
    icon: '🔍',
  },
  {
    id: 3,
    title: 'Online Bootcamp',
    description:
      'Selected ventures participate in an intensive online program covering venture building, pitch strategy, go-to-market planning, and mentorship sessions.',
    participantAction: 'Attend workshops, connect with mentors, refine your pitch.',
    status: 'upcoming',
    dateText: 'Timeline update coming soon',
    icon: '🚀',
  },
  {
    id: 4,
    title: 'Finalist Notification',
    description:
      'Top ventures from the bootcamp are selected as official VentureCraft finalists and invited to the final competition stage in Dhahran.',
    participantAction: 'Prepare your final venture deck and demo.',
    status: 'upcoming',
    dateText: 'Final schedule to be confirmed',
    icon: '🏆',
  },
  {
    id: 5,
    title: 'Acceleration Program',
    description:
      'Finalists undergo an intensive acceleration program with KFUPM researchers, DTV mentors, and industry experts to sharpen their venture before the final stage.',
    participantAction: 'Iterate, refine, and prepare for Demo Day.',
    status: 'upcoming',
    dateText: 'Dates to be announced',
    icon: '⚡',
  },
  {
    id: 6,
    title: 'Final Competition',
    description:
      'The culminating event — finalists pitch live before an international panel of judges, researchers, and investors for the $245K prize pool and a pathway to launch.',
    participantAction: 'Deliver your final pitch and compete for funding.',
    status: 'upcoming',
    dateText: 'Dates to be announced',
    icon: '🌍',
  },
];

export const competitionJourneyStages = [
  {
    id: 'pitch',
    label: 'Pitch',
    number: '01',
    headline: 'Define Your Problem',
    description:
      'Submit your idea and articulate the problem your deep-tech venture is built to solve. This is where your journey begins.',
    phases: ['Idea Submission', 'Screening'],
    // Temporary stock image. Replace with official VentureCraft photography when available.
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    imageAlt: 'Student founder presenting a startup idea in a modern innovation space',
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
    // Temporary stock image. Replace with official VentureCraft photography when available.
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    imageAlt: 'Team collaborating in a mentorship and venture building workshop',
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
    // Temporary stock image. Replace with official VentureCraft photography when available.
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    imageAlt: 'Founder on stage presenting at a major startup competition',
    imageCaption: 'Competition Experience',
  },
];
