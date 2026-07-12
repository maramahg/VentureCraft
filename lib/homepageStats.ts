export interface HomepageStat {
  value: string;
  prefix?: string;
  suffix?: string;
  label: string;
  numericValue: number; // for count-up animation
}

export const homepageStats: HomepageStat[] = [
  {
    value: '245K',
    prefix: '$',
    label: 'Prize Pool',
    numericValue: 245000,
  },
  {
    value: '100K',
    prefix: '$',
    label: 'Grand Prize',
    numericValue: 100000,
  },
  {
    value: '130',
    suffix: '+',
    label: 'Countries',
    numericValue: 130,
  },
  {
    value: '50',
    suffix: '+',
    label: 'Mentors & Experts',
    numericValue: 50,
  },
  {
    value: '7',
    label: 'Competition Phases',
    numericValue: 7,
  },
];

export const statCards = [
  {
    id: 's1',
    title: 'Participant Reach',
    value: '130+',
    subtitle: 'Countries Worldwide',
  },
  {
    id: 's2',
    title: 'Expert Network',
    value: '50+',
    subtitle: 'Global Mentors',
  },
];
