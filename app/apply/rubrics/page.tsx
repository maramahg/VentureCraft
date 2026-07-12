'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { motion } from 'framer-motion';

const rubrics = {
    screening1: {
        title: "Screening Round 1:",
        description: "Round 1 Identifies the most promising science based ideas and capable founding teams with clear articulation of problem, innovation, and feasibility. Based on part 1 of the application form along with the pitch deck and video pitch from part 3.",
        criteria: [
            { name: "Problem & Market Clarity", description: "Assesses whether the problem is clearly defined, significant, and grounded in a real, identifiable need. The team should articulate who experiences the problem, why it matters, and why it is worth solving now.", weight: 30 },
            { name: "Solution & Innovation (Scientific / Technical Basis)", description: "Evaluates the novelty and originality of the proposed solution, including whether it is grounded in credible science or technology and meaningfully differentiated from existing approaches.", weight: 30 },
            { name: "Early Business Logic", description: "Assesses whether the team demonstrates a basic understanding of how the innovation creates value, including intended users, use cases, and high level revenue logic.", weight: 20 },
            { name: "Communication & Conviction", description: "Evaluates clarity, coherence, and persuasiveness of the pitch deck and the video pitch, including the team’s ability to explain the problem and solution clearly and confidently.", weight: 20 },
        ]
    },
    screening2: {
        title: "Screening Round 2:",
        description: "Round 2 assesses the technical soundness, scientific rigor, and early validation of the proposed solution. Based on the executive summary and supporting data from part 3 in the application.",
        criteria: [
            { name: "Technical Feasibility & Validation Approach", description: "Assesses whether the solution is technically feasible based on evidence provided (experimental, simulated, calculated, or well reasoned theoretical). Teams are not penalized for lack of experimental data if assumptions are clearly justified.", weight: 25 },
            { name: "Scientific Rigor & Quality of Reasoning", description: "Evaluates the soundness of scientific or engineering logic, clarity of assumptions, grounding in first principles or literature, and acknowledgment of limitations.", weight: 20 },
            { name: "Commercial Logic & Market Credibility", description: "Assesses whether the team demonstrates a realistic understanding of the target market, customer value, and adoption pathway, consistent with the technical solution presented.", weight: 20 },
            { name: "Scalability & Development Pathway", description: "Evaluates whether the team presents a logical roadmap from current concept to scalable implementation, including key technical and commercial milestones.", weight: 20 },
            { name: "Impact & Sustainability Alignment", description: "Considers environmental, social, or economic impact and alignment with sustainability or strategic priorities.", weight: 10 },
            { name: "Clarity of Technical & Business Communication", description: "Evaluates how clearly technical concepts, assumptions, business logic, and next steps are communicated in the executive summary and any optional supporting material.", weight: 5 },
        ]
    }
};

export default function RubricsPage() {
    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 tracking-tight">Judging Rubrics</h1>
                    <p className="text-white/60 max-w-xl mx-auto">Understand how your application will be evaluated across the screening rounds.</p>
                </div>



                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {/* Screening Round 1 */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold text-vc-mint flex items-center gap-2">
                                <div className="w-2 h-8 bg-vc-mint rounded-full" />
                                {rubrics.screening1.title}
                            </h3>
                            <p className="text-white/60 text-base md:text-lg leading-relaxed pl-4 border-l border-white/10">
                                {rubrics.screening1.description}
                            </p>
                        </div>

                        <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.02]">
                            {/* Desktop Header */}
                            <div className="hidden md:grid grid-cols-12 bg-white/5 p-4 text-base font-bold uppercase tracking-widest text-white/40 border-b border-white/10">
                                <div className="col-span-4 pl-4 uppercase">Criterion</div>
                                <div className="col-span-6 uppercase">Description</div>
                                <div className="col-span-2 text-center uppercase">Weight (%)</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {rubrics.screening1.criteria.map((c, i) => (
                                    <div key={i} className="flex flex-col md:grid md:grid-cols-12 p-6 hover:bg-white/[0.02] transition-colors gap-4">
                                        <div className="md:col-span-4 font-bold text-white text-base">
                                            <span className="text-sm md:hidden block text-white/40 uppercase tracking-widest mb-1">Criterion</span>
                                            {c.name}
                                        </div>
                                        <div className="md:col-span-6 text-white/60 text-base leading-relaxed">
                                            <span className="text-base md:hidden block text-white/40 uppercase tracking-widest mb-1">Description</span>
                                            {c.description}
                                        </div>
                                        <div className="md:col-span-2 flex flex-col md:items-center md:justify-center">
                                            <span className="text-base md:hidden block text-white/40 uppercase tracking-widest mb-1">Weight</span>
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center font-bold text-vc-mint border border-vc-mint/20">
                                                {c.weight}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Screening Round 2 */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold text-vc-mint flex items-center gap-2">
                                <div className="w-2 h-8 bg-vc-mint rounded-full" />
                                {rubrics.screening2.title}
                            </h3>
                            <p className="text-white/60 text-base md:text-lg leading-relaxed pl-4 border-l border-white/10">
                                {rubrics.screening2.description}
                            </p>
                        </div>

                        <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.02]">
                            {/* Desktop Header */}
                            <div className="hidden md:grid grid-cols-12 bg-white/5 p-4 text-base font-bold uppercase tracking-widest text-white/40 border-b border-white/10">
                                <div className="col-span-4 pl-4 uppercase">Criterion</div>
                                <div className="col-span-6 uppercase">Description</div>
                                <div className="col-span-2 text-center uppercase">Weight (%)</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {rubrics.screening2.criteria.map((c, i) => (
                                    <div key={i} className="flex flex-col md:grid md:grid-cols-12 p-6 hover:bg-white/[0.02] transition-colors gap-4">
                                        <div className="md:col-span-4 font-bold text-white text-base">
                                            <span className="text-sm md:hidden block text-white/40 uppercase tracking-widest mb-1">Criterion</span>
                                            {c.name}
                                        </div>
                                        <div className="md:col-span-6 text-white/60 text-base leading-relaxed">
                                            <span className="text-base md:hidden block text-white/40 uppercase tracking-widest mb-1">Description</span>
                                            {c.description}
                                        </div>
                                        <div className="md:col-span-2 flex flex-col md:items-center md:justify-center">
                                            <span className="text-base md:hidden block text-white/40 uppercase tracking-widest mb-1">Weight</span>
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white border border-white/10 group-hover:border-vc-mint/30">
                                                {c.weight}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
