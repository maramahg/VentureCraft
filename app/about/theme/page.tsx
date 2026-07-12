'use client';

import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Zap,
    RefreshCcw,
    Settings,
    ArrowRight,
    ChevronRight,
    Target,
    BarChart3,
    CheckCircle2,
    Users,
    Lightbulb,
    FileText,
    Activity,
    Rocket
} from 'lucide-react';
import Link from 'next/link';

const pillars = [
    {
        number: 1,
        title: "Decarbonization Technologies",
        mission: "Reduce and eliminate greenhouse gas emissions through clean energy and low carbon technologies.",
        description: "This pillar focuses on technologies that directly address carbon emissions through clean energy generation, carbon removal, or emission elimination. It encompasses the fundamental shift from fossil fuels to clean energy sources and the technologies needed to capture or prevent emissions from entering the atmosphere.",
        icon: Zap,
        color: "vc-mint",
        innovationAreas: [
            {
                title: "Renewable Energy",
                items: ["Solar, wind, hydropower, geothermal, and emerging renewable technologies"]
            },
            {
                title: "Carbon Management",
                items: ["Direct air capture", "Industrial carbon capture", "CO₂ conversion & storage"]
            },
            {
                title: "Clean Transportation",
                items: ["Electric vehicles", "Hydrogen fuel systems", "Sustainable aviation & maritime fuels"]
            },
            {
                title: "Grid & Storage",
                items: ["Smart inverters", "Grid stabilization", "Renewable energy management"]
            },
            {
                title: "Clean Fuels",
                items: ["Green hydrogen", "Ammonia fuels", "Synthetic & Biofuels"]
            },
            {
                title: "Industrial & Electrification",
                items: ["Low-carbon steel/cement", "Electric heavy transport", "Industrial process electrification"]
            },
            {
                title: "Monitoring & Others",
                items: ["AI-based emission monitoring", "Satellite tracking", "Methane leak detection"]
            }
        ],
        integrationDesc: "Provides the clean energy sources and emission elimination necessary for the energy transition.",
        integrationHighlight: "text-vc-mint"
    },
    {
        number: 2,
        title: "Circular Economy & Resource Efficiency",
        mission: "Minimize waste and maximize resource utilization through circular material systems and closed loop industrial processes.",
        description: "This pillar concentrates on transforming linear consumption models into circular systems where resources are continuously reused, recycled, or regenerated. It addresses the resource intensity of energy systems by creating closed loop material flows and eliminating waste streams.",
        icon: RefreshCcw,
        color: "blue-400",
        innovationAreas: [
            {
                title: "Waste-to-Value",
                items: ["Converting plastic/agri/industrial waste into fuels or biomaterials"]
            },
            {
                title: "Advanced Recycling",
                items: ["Chemical recycling technologies", "AI powered waste sorting", "Smart recycling infrastructure"]
            },
            {
                title: "Sustainable Materials",
                items: ["Bio-based plastics", "Compostable packaging", "Biodegradable industrial materials"]
            },
            {
                title: "Resource Recovery",
                items: ["Rare metal recovery from e-waste", "Battery recycling", "Industrial chemical recovery"]
            },
            {
                title: "Water Systems",
                items: ["Industrial wastewater recycling", "Desalination efficiency", "Mineral recovery from water"]
            },
            {
                title: "Efficiency & Platforms",
                items: ["AI driven design reducing material use", "Repairable/Modular design", "Industrial symbiosis platforms"]
            }
        ],
        integrationDesc: "Ensures the resource sustainability and material security required to build and maintain sustainable energy systems.",
        integrationHighlight: "text-blue-400"
    },
    {
        number: 3,
        title: "Energy Efficiency",
        mission: "Optimize energy performance and minimize consumption across applications",
        description: "This pillar is dedicated to maximizing energy output while minimizing input across buildings, transportation, industry, and infrastructure. It focuses on technologies and systems that reduce overall energy demand through improved performance, intelligent management, and advanced materials.",
        icon: Target,
        color: "purple-400",
        innovationAreas: [
            {
                title: "Building Optimization",
                items: ["Smart HVAC & lighting", "Automated energy optimization", "Thermal management"]
            },
            {
                title: "Advanced Materials",
                items: ["High-performance thermal barriers", "Phase-change materials", "Heat-reflective coatings"]
            },
            {
                title: "Digital Management",
                items: ["Energy analytics platforms", "Digital twins for energy systems", "Predictive energy control"]
            },
            {
                title: "Industrial & Heat",
                items: ["Waste heat recovery systems", "Thermal recycling", "High-efficiency heat exchangers"]
            },
            {
                title: "Power Electronics",
                items: ["High-efficiency converters/inverters", "Energy harvesting", "Advanced semiconductors"]
            },
            {
                title: "Efficiency Storage",
                items: ["Thermal storage systems", "Behind-the-meter batteries", "Load-shifting technologies"]
            },
            {
                title: "Transport Efficiency",
                items: ["Vehicle aerodynamics", "Energy-efficient drivetrain", "Route optimization"]
            }
        ],
        integrationDesc: "Maximizes the performance and utilization of sustainable energy systems while minimizing overall energy demand.",
        integrationHighlight: "text-purple-400"
    },
    {
        number: 4,
        title: "Process Optimization & Advanced Engineering",
        mission: "Transform manufacturing and production through innovative engineering and automation",
        description: "This pillar revolutionizes how products and systems are designed, manufactured, and produced to support the sustainable energy transition. It focuses on making manufacturing processes cleaner, more efficient, and capable of producing the technologies needed for sustainable energy systems.",
        icon: Settings,
        color: "orange-400",
        innovationAreas: [
            {
                title: "Automation & Robotics",
                items: ["Autonomous manufacturing robots", "Hazardous environment robots", "Autonomous inspection drones"]
            },
            {
                title: "Advanced Manufacturing",
                items: ["3D Printing (Metal Additive Mfg)", "Precision manufacturing", "Lightweight component production"]
            },
            {
                title: "AI & Quality Control",
                items: ["Computer vision defect detection", "Predictive maintenance platforms", "Sensor-based monitoring"]
            },
            {
                title: "Digital Twins & IoT",
                items: ["Process virtual simulations", "Digital replicas of equipment", "Industrial IoT sensor networks"]
            },
            {
                title: "Engineering Innovation",
                items: ["New material fabrication processes", "Nano-manufacturing innovations", "Rapid prototyping"]
            }
        ],
        integrationDesc: "Enables the scalable production and manufacturing of sustainable energy technologies and components.",
        integrationHighlight: "text-orange-400"
    }
];

export default function ThemePage() {
    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">


            <div className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vc-mint/10 border border-vc-mint/20 text-vc-mint text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                    >
                        Competition Framework 2026
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black font-poppins mb-8 leading-tight uppercase"
                    >
                        Sustainable Energy <span className="text-vc-mint">Theme Pillars</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 border-vc-mint/10 bg-vc-mint/[0.01] text-center lg:text-left"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
                            <ShieldCheck className="w-5 h-5 text-vc-mint" />
                            Executive Overview
                        </h2>
                        <p className="text-white/60 leading-relaxed text-lg">
                            The KFUPM Venture Craft competition embraces sustainable energy innovation through four distinct yet interconnected pillars. Our framework is intentionally broad to welcome early stage startups from diverse disciplines such as AI, hardware, and clean technology, while providing a clear focus through structured innovation pathways.
                        </p>
                        <p className="text-white/40 mt-4 italic text-sm border-l-2 border-vc-mint/30 pl-4 text-left">
                            Each pillar addresses a critical dimension of the sustainable energy transition, ensuring comprehensive coverage while maintaining distinct boundaries and objectives.
                        </p>
                    </motion.div>
                </div>

                {/* Detailed Pillars Breakdown */}
                <div className="space-y-32 mb-32">
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={pillar.number}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                                <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
                                    <div className="space-y-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-vc-mint/10 border border-vc-mint/20 flex items-center justify-center mx-auto lg:mx-0 ${pillar.color === 'vc-mint' ? 'text-vc-mint' : pillar.color}`}>
                                            <pillar.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
                                            <span className="text-vc-mint">Pillar {pillar.number}:</span><br />
                                            <span className="text-white/90">{pillar.title}</span>
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 border-l-2 border-l-vc-mint/50 text-left">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-vc-mint" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-vc-mint">Mission</span>
                                            </div>
                                            <p className="text-lg font-bold italic text-white/90 leading-relaxed">
                                                "{pillar.mission}"
                                            </p>
                                        </div>
                                        <p className="text-white/60 leading-relaxed text-center lg:text-left">
                                            {pillar.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:col-span-7">
                                    <div className="glass-panel p-8 md:p-10 border-white/5 bg-white/[0.01]">
                                        <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                            <div className="w-8 h-px bg-white/10" />
                                            Key Innovation Areas
                                            <div className="w-8 h-px bg-white/10" />
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                            {pillar.innovationAreas.map((area, aidx) => (
                                                <div key={aidx} className="space-y-4 group">
                                                    <h5 className="text-[13px] font-bold text-vc-mint uppercase tracking-wider flex items-center gap-2">
                                                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                        {area.title}
                                                    </h5>
                                                    <ul className="space-y-3">
                                                        {area.items.map((item, iidx) => (
                                                            <li key={iidx} className="flex items-start gap-3 text-sm text-white/40 group-hover:text-white/60 transition-colors leading-snug">
                                                                <div className="w-1 h-1 rounded-full bg-vc-mint/40 mt-2 shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pillar Integration Table */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mb-32"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Pillar Integration</h2>
                        <p className="text-white/40">How Each Pillar Supports Sustainable Energy Focus</p>
                    </div>

                    <div className="glass-panel overflow-hidden border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            {pillars.map(p => (
                                <div key={p.number} className="flex flex-col">
                                    <div className="p-6 text-center bg-white/5 border-b border-white/10">
                                        <span className="text-[10px] font-bold text-vc-mint uppercase tracking-widest block mb-1">Pillar {p.number}</span>
                                        <h3 className="text-sm font-black text-white/90 uppercase h-10 flex items-center justify-center">{p.title}</h3>
                                    </div>
                                    <div className={`p-8 text-center space-y-4 flex-1 border-t-2 ${p.integrationHighlight.replace('text-', 'border-t-')}`}>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            {p.integrationDesc.split(/(Provides the |clean energy sources|emission elimination|Ensures the |resource sustainability|material security|Maximizes the |performance and utilization|Enables the |scalable production|manufacturing)/).map((part, i) => {
                                                const highlights = [
                                                    "clean energy sources", "emission elimination",
                                                    "resource sustainability", "material security",
                                                    "performance and utilization",
                                                    "scalable production", "manufacturing"
                                                ];
                                                if (highlights.includes(part)) {
                                                    return <strong key={i} className={p.integrationHighlight}>{part}</strong>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Measurable Impact Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mb-32 bg-vc-mint/[0.02] border border-vc-mint/10 rounded-[2.5rem] p-8 md:p-16"
                >
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3 space-y-6 text-center lg:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center text-vc-mint mx-auto lg:mx-0">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black uppercase leading-tight">Examples of <br /><span className="text-vc-mint">Measurable Impact</span></h2>
                            <p className="text-white/40 leading-relaxed">
                                We evaluate innovations based on their primary quantifiable contribution to the sustainable energy landscape.
                            </p>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="overflow-x-auto border border-white/10 rounded-2xl">
                                <table className="w-full text-left min-w-[500px]">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Pillar</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Impact Metric</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">What It Measures</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[
                                            { p: "1: Decarbonization", m: "CO₂ Reduction Potential", d: "Emissions avoided or captured" },
                                            { p: "2: Circular Economy", m: "Material Recovery Rate (%)", d: "Waste converted into usable resources" },
                                            { p: "3: Energy Efficiency", m: "Energy Savings (%)", d: "Reduction in energy use per unit output" },
                                            { p: "4: Process Optimization", m: "Throughput Improvement (%)", d: "Production output increase under same resources" }
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-5 text-sm font-bold text-white/80">{row.p}</td>
                                                <td className="p-5 text-sm text-vc-mint font-bold italic">{row.m}</td>
                                                <td className="p-5 text-xs text-white/40">{row.d}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* How to Choose Your Pillar */}
                <div className="max-w-4xl mx-auto mb-32">
                    <div className="text-center mb-12">
                        <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-6">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-4">How to Choose Your Pillar</h2>
                        <p className="text-white/50">Follow the Pillar Selection Rule to ensure correct categorization.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-panel p-8 border-vc-mint/30 bg-vc-mint/[0.03] text-center">
                            <h3 className="text-xs font-black text-vc-mint uppercase tracking-[0.3em] mb-4">Pillar Selection Rule</h3>
                            <p className="text-lg md:text-xl font-bold text-white mb-4 leading-relaxed">
                                Startups must select the pillar that represents the <span className="text-vc-mint italic">primary measurable impact</span> of their innovation.
                            </p>
                            <p className="text-white/40 text-sm max-w-2xl mx-auto italic">
                                While solutions may influence multiple areas, evaluation will focus on the pillar where the startup delivers its strongest quantifiable impact.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pillars.map(p => (
                                <div key={p.number} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                                        ${p.number === 1 ? 'bg-vc-mint/15 text-vc-mint' : ''}
                                        ${p.number === 2 ? 'bg-blue-400/15 text-blue-400' : ''}
                                        ${p.number === 3 ? 'bg-purple-400/15 text-purple-400' : ''}
                                        ${p.number === 4 ? 'bg-orange-400/15 text-orange-400' : ''}
                                    `}>
                                        P{p.number}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1 uppercase h-10 flex items-center">{p.title}</h4>
                                        <p className="text-xs text-white/40 leading-relaxed font-medium">
                                            {p.number === 1 && "If your innovation reduces or eliminates greenhouse gas emissions."}
                                            {p.number === 2 && "If your innovation reduces material waste or recovers resources."}
                                            {p.number === 3 && "If your innovation reduces the energy required to perform a task."}
                                            {p.number === 4 && "If your innovation improves how industrial systems are designed, built, or operated."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-24 border-t border-white/5">
                    <div className="flex justify-center pt-6">
                        <Link
                            href="/apply/materials"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-vc-mint text-vc-green-dark hover:bg-vc-teal hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-bold text-sm uppercase tracking-widest shadow-lg shadow-vc-mint/20"
                        >
                            <span>Study Application Materials</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
