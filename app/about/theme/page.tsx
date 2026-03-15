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
        mission: "Reduce and eliminate greenhouse gas emissions through clean energy and low-carbon technologies.",
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
        ]
    },
    {
        number: 2,
        title: "Circular Economy & Resource Efficiency",
        mission: "Minimize waste and maximize resource utilization through circular material systems and closed-loop industrial processes.",
        description: "This pillar concentrates on transforming linear consumption models into circular systems where resources are continuously reused, recycled, or regenerated. It addresses the resource intensity of energy systems by creating closed-loop material flows and eliminating waste streams.",
        icon: RefreshCcw,
        color: "blue-400",
        innovationAreas: [
            {
                title: "Waste-to-Value",
                items: ["Converting plastic/agri/industrial waste into fuels or biomaterials"]
            },
            {
                title: "Advanced Recycling",
                items: ["Chemical recycling technologies", "AI-powered waste sorting", "Smart recycling infrastructure"]
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
                items: ["AI-driven design reducing material use", "Repairable/Modular design", "Industrial symbiosis platforms"]
            }
        ]
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
        ]
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
        ]
    }
];

export default function ThemePage() {
    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[5%] left-[5%] w-[35%] h-[40%] bg-vc-mint/8 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[40%] right-[0%] w-[30%] h-[35%] bg-teal-500/8 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[30%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Decorative Grid */}
            <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

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
                        className="glass-panel p-8 border-vc-mint/10 bg-vc-mint/[0.01] text-left"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-vc-mint" />
                            Executive Overview
                        </h2>
                        <p className="text-white/60 leading-relaxed text-lg">
                            The KFUPM Venture Craft competition embraces sustainable energy innovation through four distinct yet interconnected pillars. Our framework is intentionally broad to welcome early-stage startups from diverse disciplines—AI, hardware, software, clean technology, materials science, biotechnology, process engineering, and beyond—while providing clear focus through structured innovation pathways.
                        </p>
                        <p className="text-white/40 mt-4 italic text-sm border-l-2 border-vc-mint/30 pl-4">
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
                                <div className="lg:col-span-5 space-y-8">
                                    <div className="space-y-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-vc-mint/10 border border-vc-mint/20 flex items-center justify-center ${pillar.color === 'vc-mint' ? 'text-vc-mint' : pillar.color}`}>
                                            <pillar.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
                                            <span className="text-vc-mint">Pillar {pillar.number}:</span><br />
                                            <span className="text-white/90">{pillar.title}</span>
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 border-l-2 border-l-vc-mint/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-vc-mint" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-vc-mint">Mission</span>
                                            </div>
                                            <p className="text-lg font-bold italic text-white/90 leading-relaxed">
                                                "{pillar.mission}"
                                            </p>
                                        </div>
                                        <p className="text-white/60 leading-relaxed">
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
                        <div className="grid grid-cols-1 md:grid-cols-4 bg-white/5 border-b border-white/10 lowercase">
                            {pillars.map(p => (
                                <div key={p.number} className="p-6 text-center border-r border-white/10 last:border-r-0">
                                    <span className="text-[10px] font-bold text-vc-mint uppercase tracking-widest block mb-1">Pillar {p.number}</span>
                                    <h3 className="text-sm font-black text-white/90 uppercase h-10 flex items-center justify-center">{p.title}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-white/10">
                            <div className="p-8 text-center space-y-4 border-t-2 border-t-vc-mint">
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Provides the <strong className="text-vc-mint">clean energy sources</strong> and <strong className="text-vc-mint">emission elimination</strong> necessary for the energy transition.
                                </p>
                            </div>
                            <div className="p-8 text-center space-y-4 border-t-2 border-t-blue-400">
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Ensures the <strong className="text-blue-400">resource sustainability</strong> and <strong className="text-blue-400">material security</strong> required to build and maintain sustainable energy systems.
                                </p>
                            </div>
                            <div className="p-8 text-center space-y-4 border-t-2 border-t-purple-400">
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Maximizes the <strong className="text-purple-400">performance and utilization</strong> of sustainable energy systems while minimizing overall energy demand.
                                </p>
                            </div>
                            <div className="p-8 text-center space-y-4 border-t-2 border-t-orange-400">
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Enables the <strong className="text-orange-400">scalable production</strong> and <strong className="text-orange-400">manufacturing</strong> of sustainable energy technologies and components.
                                </p>
                            </div>
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
                        <div className="lg:w-1/3 space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center text-vc-mint">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black uppercase leading-tight">Examples of <br /><span className="text-vc-mint">Measurable Impact</span></h2>
                            <p className="text-white/40 leading-relaxed">
                                We evaluate innovations based on their primary quantifiable contribution to the sustainable energy landscape.
                            </p>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="overflow-hidden border border-white/10 rounded-2xl">
                                <table className="w-full text-left">
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

                {/* Competition Framework */}
                <div className="pt-24 border-t border-white/5 space-y-20">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center text-vc-mint mx-auto border border-vc-mint/20">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tight">Competition Framework</h2>
                        <p className="text-white/40 leading-relaxed text-lg">
                            A comprehensive innovation ecosystem where diverse technological approaches converge around a shared mission of accelerating the global transition to sustainable energy systems.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-24">
                        {/* Broad Innovation Welcome */}
                        <div className="space-y-8 group">
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                <div className="w-2 h-10 rounded-full bg-vc-mint opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-2xl font-bold uppercase tracking-tight">Broad Innovation Welcome</h3>
                            </div>
                            <p className="text-white/40 leading-relaxed italic text-sm text-center md:text-left">
                                The framework accommodates innovations from any discipline that contributes to sustainable energy through one or more pillars:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.01] p-8 rounded-[2rem] border border-white/5">
                                {[
                                    { t: "Technology Startups", d: "Hardware, software, materials, and system innovations" },
                                    { t: "Digital Solutions", d: "Platforms, analytics, AI/ML, and data-driven approaches" },
                                    { t: "Business Model Innovation", d: "New approaches to sustainability challenges" },
                                    { t: "Service Innovation", d: "Novel service delivery models for sustainable energy" },
                                    { t: "Social Innovation", d: "Community-based and behavioral solutions" }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <h4 className="text-sm font-bold text-vc-mint uppercase tracking-wider">{item.t}</h4>
                                        <p className="text-xs text-white/40 font-medium">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Evaluation Criteria */}
                        <div className="space-y-10 group">
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                <div className="w-2 h-10 rounded-full bg-vc-teal opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-2xl font-bold uppercase tracking-tight">Evaluation Criteria</h3>
                            </div>
                            <p className="text-white/40 leading-relaxed italic text-sm text-center md:text-left">
                                Our evaluation process focuses on five core dimensions of innovation excellence:
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { t: "Sustainable Energy Impact", d: "Clear contribution to the sustainable energy transition", icon: Zap },
                                    { t: "Innovation Potential", d: "Technical or business model breakthrough capability", icon: Lightbulb },
                                    { t: "Scalability", d: "Ability to achieve meaningful scale and widespread adoption", icon: Rocket },
                                    { t: "Team Excellence", d: "Capability to execute on the proposed innovation", icon: Users },
                                    { t: "Market Opportunity", d: "Addressing real market needs with commercial potential", icon: BarChart3 }
                                ].map((item, i) => (
                                    <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-vc-mint/30 hover:bg-white/[0.04] transition-all flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-vc-mint group-hover:border-vc-mint/20 transition-all">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-white/90 mb-1">{item.t}</h4>
                                            <p className="text-sm text-white/40 font-medium">{item.d}</p>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-vc-mint/20 group-hover:text-vc-mint transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Quote */}
                        <div className="relative p-8 md:p-12 bg-[#0a1a18] border border-white/8 overflow-hidden">
                            <p className="text-xl md:text-2xl font-normal text-white/85 leading-relaxed text-center tracking-wide">
                                The KFUPM Venture Craft competition creates a comprehensive innovation ecosystem where diverse technological approaches converge around the shared mission of accelerating the global transition to sustainable energy systems.
                            </p>
                        </div>

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
            </div>

            <Footer />
        </main>
    );
}
