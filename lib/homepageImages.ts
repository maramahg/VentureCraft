// All images are temporary stock photos from Unsplash.
// Replace with official VentureCraft photography when available.
// Each image is marked with isTemporary: true for easy future identification.

export interface HomepageImage {
  src: string;
  alt: string;
  caption: string;
  category: string;
  isTemporary: true;
  futureReplacementNote: string;
}

export const journeyImages = {
  pitch: {
    src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=85',
    alt: 'Student founder presenting a startup idea in a modern innovation environment',
    caption: 'Founder Pitch',
    category: 'Competition Journey',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with official VentureCraft pitch session photography',
  },
  accelerate: {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85',
    alt: 'Team collaborating in a mentorship and venture building workshop session',
    caption: 'Mentorship & Venture Building',
    category: 'Competition Journey',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with official VentureCraft bootcamp photography',
  },
  launch: {
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=85',
    alt: 'Entrepreneur presenting on stage at an international startup competition',
    caption: 'Competition Experience',
    category: 'Competition Journey',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with official VentureCraft final competition photography',
  },
};

// Temporary stock images. Replace with official VentureCraft photography when available.
export const proofWallImages: HomepageImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=85',
    alt: 'Researcher working with advanced technology in a university laboratory',
    caption: 'Deep-Tech Innovation',
    category: 'Proof Wall',
    isTemporary: true,
    futureReplacementNote: 'Replace with KFUPM lab photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=85',
    alt: 'Students collaborating on a technology project in a modern university setting',
    caption: 'University Innovation Ecosystem',
    category: 'Proof Wall',
    isTemporary: true,
    futureReplacementNote: 'Replace with VentureCraft team collaboration photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=85',
    alt: 'Expert mentor guiding a startup team through venture development strategy',
    caption: 'Acceleration Experience',
    category: 'Proof Wall',
    isTemporary: true,
    futureReplacementNote: 'Replace with official mentor session photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85',
    alt: 'Modern research and innovation campus facility',
    caption: 'Research to Market',
    category: 'Proof Wall',
    isTemporary: true,
    futureReplacementNote: 'Replace with KFUPM campus photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85',
    alt: 'International startup community networking at a global entrepreneurship event',
    caption: 'Global Startup Network',
    category: 'Proof Wall',
    isTemporary: true,
    futureReplacementNote: 'Replace with VentureCraft event photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=85',
    alt: 'Sustainable energy research and renewable technology development',
    caption: 'Sustainable Energy Research',
    category: 'Proof Wall',
    isTemporary: true,
    futureReplacementNote: 'Replace with deep-tech research photography',
  },
];

// Temporary stock images. Replace with official VentureCraft photography when available.
export const involvedImages = {
  compete: {
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=85',
    alt: 'Student founders working together on a deep-tech startup venture',
    caption: 'Founder Teams',
    category: 'Get Involved',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with VentureCraft participant photography',
  },
  mentor: {
    src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=85',
    alt: 'Expert mentor providing guidance to startup founders in a professional setting',
    caption: 'Expert Mentorship',
    category: 'Get Involved',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with VentureCraft mentor photography',
  },
  sponsor: {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85',
    alt: 'Corporate innovation partnership and ecosystem collaboration',
    caption: 'Innovation Partnership',
    category: 'Get Involved',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with VentureCraft sponsor event photography',
  },
  ambassador: {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85',
    alt: 'Student ambassador representing a university entrepreneurship community',
    caption: 'Community Leadership',
    category: 'Get Involved',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with VentureCraft ambassador photography',
  },
  partner: {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85',
    alt: 'Institutional collaboration between universities and innovation organizations',
    caption: 'Institutional Collaboration',
    category: 'Get Involved',
    isTemporary: true as const,
    futureReplacementNote: 'Replace with VentureCraft partner event photography',
  },
};

// Temporary stock images. Replace with official VentureCraft photography when available.
export const ventureAreaImages: Record<string, HomepageImage> = {
  sustainableEnergy: {
    src: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&q=80',
    alt: 'Sustainable energy technology and renewable power research',
    caption: 'Sustainable Energy',
    category: 'Venture Areas',
    isTemporary: true,
    futureReplacementNote: 'Replace with relevant deep-tech photography',
  },
  decarbonization: {
    src: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=700&q=80',
    alt: 'Industrial decarbonization and clean technology innovation',
    caption: 'Decarbonization',
    category: 'Venture Areas',
    isTemporary: true,
    futureReplacementNote: 'Replace with relevant deep-tech photography',
  },
  aiData: {
    src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&q=80',
    alt: 'Artificial intelligence and data science for energy applications',
    caption: 'AI & Data for Energy',
    category: 'Venture Areas',
    isTemporary: true,
    futureReplacementNote: 'Replace with relevant deep-tech photography',
  },
  robotics: {
    src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80',
    alt: 'Advanced robotics and industrial automation technology',
    caption: 'Robotics & Automation',
    category: 'Venture Areas',
    isTemporary: true,
    futureReplacementNote: 'Replace with relevant deep-tech photography',
  },
};

export const mosaicImages = {
  main: {
    src: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=1600&q=85',
    alt: 'Tech ecosystem leaders collaborating on innovation',
    caption: 'Ecosystem Leaders',
    category: 'Credibility Mosaic',
    isTemporary: true,
    futureReplacementNote: 'Replace with VentureCraft partners and judges',
  }
};

