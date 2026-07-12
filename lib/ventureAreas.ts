export interface VentureArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageKey?: string;
  featured?: boolean;
}

export const ventureAreas: VentureArea[] = [
  {
    id: 'sustainable-energy',
    title: 'Sustainable Energy',
    description:
      'Ventures developing renewable energy solutions, solar technology, wind power systems, and sustainable fuel alternatives for a carbon-neutral future.',
    icon: '☀️',
    imageKey: 'sustainableEnergy',
    featured: true,
  },
  {
    id: 'decarbonization',
    title: 'Decarbonization',
    description:
      'Technologies and systems aimed at reducing CO₂ emissions across industrial, transportation, and energy production sectors.',
    icon: '🌿',
    imageKey: 'decarbonization',
    featured: true,
  },
  {
    id: 'energy-storage',
    title: 'Energy Storage',
    description:
      'Advanced battery technologies, grid-scale storage systems, and novel materials enabling reliable, large-scale energy storage.',
    icon: '🔋',
    imageKey: 'energyStorage',
  },
  {
    id: 'ai-data',
    title: 'AI & Data for Energy',
    description:
      'Artificial intelligence, machine learning, and data analytics applications that optimize energy systems, predict demand, and reduce waste.',
    icon: '🤖',
    imageKey: 'aiData',
  },
  {
    id: 'industrial-innovation',
    title: 'Industrial Innovation',
    description:
      'Process innovation, smart manufacturing, and industrial efficiency technologies that reduce environmental footprint at scale.',
    icon: '🏭',
    imageKey: 'industrialInnovation',
  },
  {
    id: 'advanced-materials',
    title: 'Advanced Materials',
    description:
      'Next-generation materials science covering metamaterials, composites, and nanomaterials to enable breakthrough applications in energy and industry.',
    icon: '⚗️',
    imageKey: 'advancedMaterials',
  },
  {
    id: 'robotics',
    title: 'Robotics & Automation',
    description:
      'Robotic systems and intelligent automation for inspection, maintenance, and operations in energy-intensive or hazardous environments.',
    icon: '🦾',
    imageKey: 'robotics',
  },
];

export const ventureAreaDisclaimer =
  'Ideal venture areas may include the following deep tech and sustainable energy tracks:';
