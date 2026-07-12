export interface InvolvedTab {
  id: string;
  label: string;
  who: string;
  why: string;
  what: string[];
  cta: string;
  ctaHref: string;
  imageKey: string;
}

export const getInvolvedTabs: InvolvedTab[] = [
  {
    id: 'compete',
    label: 'Compete',
    who: 'For student led ventures building science and technology solutions with global impact.',
    why: 'Access a $245K prize pool, world class mentorship, and a direct path from research to market — powered by KFUPM and DTV.',
    what: [
      'Submit your deep tech startup idea',
      'Receive structured mentorship and feedback',
      'Pitch to an international panel of judges',
      'Compete for $100K Grand Prize',
    ],
    cta: 'View Competition Details',
    ctaHref: '/apply',
    imageKey: 'compete',
  },
  {
    id: 'mentor',
    label: 'Mentor',
    who: 'For industry experts, researchers, and entrepreneurs who want to shape the next generation of deep tech founders.',
    why: 'Guide promising ventures at a critical stage. Your expertise can help a student founder build something that matters.',
    what: [
      'Join a curated panel of 50+ mentors',
      'Lead workshops and 1:1 sessions',
      'Evaluate and support shortlisted ventures',
      'Connect with KFUPM and DTV innovation networks',
    ],
    cta: 'Support Founders',
    ctaHref: '/contact',
    imageKey: 'mentor',
  },
  {
    id: 'sponsor',
    label: 'Sponsor',
    who: 'For companies and organizations committed to advancing deep tech innovation and the next generation of entrepreneurs.',
    why: 'Gain visibility among 130+ countries of student founders, researchers, and institutional partners — all in one global platform.',
    what: [
      'Brand presence across all competition stages',
      'Direct access to top-performing ventures',
      'Co branding with KFUPM and DTV',
      'Contribute to meaningful deep tech impact',
    ],
    cta: 'Partner With Venture Craft',
    ctaHref: '/contact',
    imageKey: 'sponsor',
  },
  {
    id: 'ambassador',
    label: 'Ambassador',
    who: 'For students and early career professionals who want to represent Venture Craft in their university or community.',
    why: 'Build leadership skills, expand your network, and help bring the Venture Craft opportunity to founders in your region.',
    what: [
      'Represent Venture Craft at your university',
      'Run local outreach and awareness campaigns',
      'Earn recognition and exclusive opportunities',
      'Be part of a global ambassador community',
    ],
    cta: 'Represent Venture Craft',
    ctaHref: '/ambassadors',
    imageKey: 'ambassador',
  },
];
