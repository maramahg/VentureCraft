export interface Partner {
  id: string;
  name: string;
  logoSrc?: string;
  role: 'organizer' | 'collaborator' | 'sponsor' | 'partner';
  tier?: 'gold' | 'silver' | 'bronze';
  href?: string;
  description?: string;
}

export const organizers: Partner[] = [
  {
    id: 'kfupm',
    name: 'KFUPM',
    logoSrc: '/kfupm-logo.png',
    role: 'organizer',
    href: 'https://www.kfupm.edu.sa',
    description: 'King Fahd University of Petroleum & Minerals',
  },
  {
    id: 'dtv',
    name: 'DTV',
    logoSrc: '/dtv-logo.png',
    role: 'collaborator',
    href: 'https://www.dtv.com.sa',
    description: 'Dhahran Tech Valley',
  },
];

// Placeholder sponsors/partners — add real ones when available
export const sponsors: Partner[] = [];

export const allPartners = [...organizers, ...sponsors];
