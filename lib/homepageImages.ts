// Images sourced from KFUPM (kfupm.edu.sa) and DTV / Dhahran Techno Valley (dtv.sa) media.

export interface HomepageImage {
  src: string;
  alt: string;
  caption: string;
  category: string;
  isTemporary: boolean;
  futureReplacementNote: string;
}

export const journeyImages = {
  pitch: {
    src: '/images/kfupm/students.jpg',
    alt: 'KFUPM student team presenting their engineering project',
    caption: 'Founder Pitch',
    category: 'Competition Journey',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
  accelerate: {
    src: '/images/kfupm/research-centers.png',
    alt: 'KFUPM Research & Innovation mentor guiding a student in the lab',
    caption: 'Mentorship & Venture Building',
    category: 'Competition Journey',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
  launch: {
    src: '/images/dtv/hero.png',
    alt: 'Dhahran Techno Valley innovation ecosystem experience',
    caption: 'Competition Experience',
    category: 'Competition Journey',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
};

export const proofWallImages: HomepageImage[] = [
  {
    src: '/images/kfupm/research-centers.png',
    alt: 'KFUPM Research & Innovation lab with robotics equipment',
    caption: 'Deep Tech Innovation',
    category: 'Proof Wall',
    isTemporary: false,
    futureReplacementNote: '',
  },
  {
    src: '/images/kfupm/entrepreneurship-ecosystem.jpeg',
    alt: 'KFUPM Esteedamah solar car team showcasing their entrepreneurship project',
    caption: 'University Innovation Ecosystem',
    category: 'Proof Wall',
    isTemporary: false,
    futureReplacementNote: '',
  },
  {
    src: '/images/dtv/sustainability.jpg',
    alt: 'Researcher conducting sustainable energy experiments in a DTV lab',
    caption: 'Acceleration Experience',
    category: 'Proof Wall',
    isTemporary: false,
    futureReplacementNote: '',
  },
  {
    src: '/images/dtv/robotics.jpg',
    alt: 'DTV robotics and drone research and development',
    caption: 'Research to Market',
    category: 'Proof Wall',
    isTemporary: false,
    futureReplacementNote: '',
  },
  {
    src: '/images/kfupm/international-students.jpg',
    alt: 'International KFUPM students holding flags in front of the KFUPM sign',
    caption: 'Global Startup Network',
    category: 'Proof Wall',
    isTemporary: false,
    futureReplacementNote: '',
  },
  {
    src: '/images/dtv/hero.png',
    alt: 'Dhahran Techno Valley innovation ecosystem near the Khobar coastline',
    caption: 'Sustainable Energy Research',
    category: 'Proof Wall',
    isTemporary: false,
    futureReplacementNote: '',
  },
];

export const involvedImages = {
  compete: {
    src: '/images/kfupm/students.jpg',
    alt: 'KFUPM student founders working together on a deep tech project',
    caption: 'Founder Teams',
    category: 'Get Involved',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
  mentor: {
    src: '/images/kfupm/research-centers.png',
    alt: 'KFUPM Research & Innovation mentor providing guidance in the lab',
    caption: 'Expert Mentorship',
    category: 'Get Involved',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
  sponsor: {
    src: '/images/dtv/hero.png',
    alt: 'Dhahran Techno Valley innovation and technology ecosystem',
    caption: 'Innovation Partnership',
    category: 'Get Involved',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
  ambassador: {
    src: '/images/kfupm/international-students.jpg',
    alt: 'KFUPM student ambassadors representing the university community',
    caption: 'Community Leadership',
    category: 'Get Involved',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
  partner: {
    src: '/images/kfupm/hero.png',
    alt: 'KFUPM community collaborating across the university ecosystem',
    caption: 'Institutional Collaboration',
    category: 'Get Involved',
    isTemporary: false as const,
    futureReplacementNote: '',
  },
};

export const ventureAreaImages: Record<string, HomepageImage> = {
  sustainableEnergy: {
    src: '/images/dtv/sustainability.jpg',
    alt: 'Sustainable energy research inside a DTV lab',
    caption: 'Sustainable Energy',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
  decarbonization: {
    src: '/images/kfupm/entrepreneurship-ecosystem.jpeg',
    alt: 'KFUPM Esteedamah solar car team, a decarbonization and clean-tech venture',
    caption: 'Decarbonization',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
  energyStorage: {
    src: '/images/dtv/sustainability.jpg',
    alt: 'Energy storage research facility at Dhahran',
    caption: 'Energy Storage',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
  aiData: {
    src: '/images/kfupm/research-centers.png',
    alt: 'KFUPM Research & Innovation team working with robotics and data systems',
    caption: 'AI & Data for Energy',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
  industrialInnovation: {
    src: '/images/kfupm/hero.png',
    alt: 'Industrial innovation and research park infrastructure at KFUPM',
    caption: 'Industrial Innovation',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
  advancedMaterials: {
    src: '/images/kfupm/research-centers.png',
    alt: 'Advanced materials development lab at DTV',
    caption: 'Advanced Materials',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
  robotics: {
    src: '/images/dtv/robotics.jpg',
    alt: 'DTV robotics and drone research and development',
    caption: 'Robotics & Automation',
    category: 'Venture Areas',
    isTemporary: false,
    futureReplacementNote: '',
  },
};

export const mosaicImages = {
  main: {
    src: '/images/kfupm/hero.png',
    alt: 'KFUPM and DTV ecosystem leaders collaborating on innovation',
    caption: 'Ecosystem Leaders',
    category: 'Credibility Mosaic',
    isTemporary: false,
    futureReplacementNote: '',
  }
};

