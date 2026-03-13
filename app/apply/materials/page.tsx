'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Download, ChevronDown, FileText, AlertCircle, FileCode, ExternalLink, Rocket } from 'lucide-react';
import SimulatedApplicationModal from '@/components/SimulatedApplicationModal';

const ALERT_ICON = (
    <div className="w-1.5 h-1.5 rounded-full bg-vc-mint shadow-[0_0_10px_rgba(79,209,197,0.5)]" />
);

interface DocumentResource {
    label: string;
    sublabel: string;
    pdfUrl: string;
    pptxUrl?: string;
    previewUrl?: string;
}

interface ApplicationMaterial {
    number: number;
    title: string;
    format: string;
    length: string;
    purpose: string;
    intro?: string;
    content: {
        title: string;
        items?: (string | React.ReactNode)[];
        alphaItems?: string[];
        nestedItems?: {
            title: string;
            subItems: string[];
            nestedNote?: {
                title: string;
                items: string[];
            };
        }[];
        documents?: DocumentResource[];
        templateUrl?: string;
        templatePptxUrl?: string;
        brandedUrl?: string;
    };
    extra?: {
        title: string;
        items: string[];
        formats: {
            title: string;
            list: string[];
        };
        quality: {
            title: string;
            list: string[];
        };
        instructions: {
            title: string;
            list: (string | React.ReactNode)[];
        };
    };
    note?: string;
}

const applicationMaterials: ApplicationMaterial[] = [
    {
        number: 1,
        title: "PITCH DECK",
        format: "PDF or PowerPoint",
        length: "Maximum of 15 slides",
        purpose: "Provides a concise overview of the startup. Used to assess clarity, logic, and communication quality.",
        content: {
            title: "Expected content includes (but is not limited to):",
            items: [
                "Team structure",
                "Identity, mission, and vision",
                "Problem statement and proposed solution",
                "Market size, competition, and validation",
                "Business model",
                "Financial overview",
                "Traction and growth strategy"
            ],
            documents: [
                {
                    label: "Template",
                    sublabel: "Official Pitch Deck Guide",
                    pdfUrl: "/samples/venture-craft-pitch-deck-template.pdf",
                    pptxUrl: "/samples/venture-craft-pitch-deck-sample.pptx"
                },
                {
                    label: "Sample",
                    sublabel: "Venture Craftee Sample",
                    pdfUrl: "/samples/venture-craftee-pitch-deck.pdf",
                    pptxUrl: "/samples/venture-craftee-pitch-deck.pptx",
                    previewUrl: "/venture-craftee-pitch-deck.html"
                }
            ],
            templateUrl: "/samples/venture-craft-pitch-deck-template.pdf",
            templatePptxUrl: "/samples/venture-craft-pitch-deck-sample.pptx",
            brandedUrl: "/venture-craftee-pitch-deck.html"
        }
    },
    {
        number: 2,
        title: "EXECUTIVE SUMMARY",
        format: "PDF or Microsoft Word",
        length: "1 - 2 pages",
        purpose: "Summarizes the full business case.",
        intro: "The executive summary should function as a standalone, persuasive document that summarizes the entire content.",
        content: {
            title: "Must include:",
            alphaItems: [
                "Problem statement",
                "Innovation & technical basis",
                "Market opportunity",
                "Business model",
                "Team & capabilities",
                "Impact & sustainability"
            ],
            documents: [
                {
                    label: "Reference Sample",
                    sublabel: "Venture Craftee Example",
                    pdfUrl: "/samples/venture-craftee-executive-summary.pdf",
                    previewUrl: "/venture-craftee-executive-summary.html"
                }
            ],
            templateUrl: "/samples/venture-craftee-executive-summary.pdf",
            brandedUrl: "/venture-craftee-executive-summary.html"
        }
    },
    {
        number: 3,
        title: "VIDEO PITCH",
        format: "Unlisted YouTube link",
        length: "3 - 5 minutes",
        purpose: "The video pitch is an opportunity to clearly communicate your startup’s value proposition and why it is worth investing in. It allows teams to present their idea in a more engaging and memorable way than written materials alone.",
        content: {
            title: "Expected Content:",
            items: [
                "The video pitch should explain the startup idea and its value proposition.",
                "Teams may reference or present parts of their pitch deck, but they are not required to present every slide.",
                "Teams should focus on the key elements that best communicate their idea within the 3–5 minute timeframe."
            ]
        },
        extra: {
            title: "Team Representation:",
            items: [
                "Not all team members are required to appear in the video.",
                "One representative (such as the team leader) may present on behalf of the team.",
                "The presenter should briefly introduce the team and explain each member’s role in the startup."
            ],
            formats: {
                title: "Acceptable formats include:",
                list: [
                    "Presenting a pitch deck or slides while explaining the idea.",
                    "Screen-sharing slides while presenting (using Zoom, Microsoft Teams, Google Meet, or similar tools).",
                    "Recording in front of a physical screen or display with slides.",
                    "Creating a creative video pitch (e.g., storytelling, product demonstration, or concept explanation)."
                ]
            },
            quality: {
                title: "Technical and Quality requirements:",
                list: [
                    "Clear audio and visible slides.",
                    "Professional but simple production is acceptable.",
                    "Language: English (professional and consistent throughout the video)."
                ]
            },
            instructions: {
                title: "Video submission instructions:",
                list: [
                    "Upload: Click the \"Create\" icon in YouTube and select \"Upload video\".",
                    (
                        <div className="flex flex-col">
                            <span>Set Visibility: On the \"Visibility\" step, choose Unlisted.</span>
                            <span className="text-vc-mint italic font-medium mt-1">
                                Note: Videos must be set to Unlisted (not Public or Private).
                            </span>
                        </div>
                    ),
                    "Share: Once processed, copy the video link and submit on the form."
                ]
            }
        }
    },
    {
        number: 4,
        title: "SUPPORTING DATA",
        format: "PDF or Microsoft Word",
        length: "Maximum of 5 pages",
        purpose: "Allows teams to provide additional proof of concept, technical validation, or detailed data that supports the claims made in the summary and deck.",
        intro: "Depending on the maturity of the idea, submissions may include:",
        content: {
            title: "Depending on the maturity of the idea, submissions may include:",
            nestedItems: [
                {
                    title: "Conceptual or system-level descriptions",
                    subItems: [
                        "High-level system architecture, workflows, or process diagrams",
                        "Explanation of underlying scientific or engineering principles"
                    ]
                },
                {
                    title: "Analytical or calculated results",
                    subItems: [
                        "Engineering calculations, scaling estimates, or first-principles analysis",
                        "Order-of-magnitude estimates supporting feasibility"
                    ]
                },
                {
                    title: "Simulated or computational results",
                    subItems: [
                        "Simulation outputs, modeling results, or virtual experiments",
                        "Figures, plots, or screenshots illustrating performance or behavior",
                        "Brief explanation of assumptions and methodology (raw code not required)"
                    ],
                    nestedNote: {
                        title: "If included:",
                        items: [
                            "Only summarized outputs, figures, screenshots, or explanations are required.",
                            "Full simulation files, executable models, or software access are not required."
                        ]
                    }
                },
                {
                    title: "Prototype or proof-of-concept (if available)",
                    subItems: [
                        "Description of the prototype and its maturity level",
                        "Images, diagrams, or summarized test results"
                    ]
                },
                {
                    title: "Literature-based justification",
                    subItems: [
                        "References to academic literature, prior art, or industry benchmarks",
                        "Explanation of how existing work supports the proposed approach"
                    ]
                }
            ],
            documents: [
                {
                    label: "Reference Sample",
                    sublabel: "Venture Craftee Example",
                    pdfUrl: "/samples/venture-craftee-supporting-data.pdf",
                    previewUrl: "/venture-craftee-supporting-data.html"
                }
            ],
            templateUrl: "/samples/venture-craftee-supporting-data.pdf",
            brandedUrl: "/venture-craftee-supporting-data.html"
        },
        note: "Supporting data is used to enhance technical evaluation, but the absence of supporting data will not negatively affect eligibility. Emphasis is placed on clarity, relevance, and technical reasoning rather than volume or complexity."
    }
];

export default function MaterialsPage() {
    const [downloadOpen, setDownloadOpen] = useState<Record<string, boolean>>({});
    const [activeDoc, setActiveDoc] = useState<Record<string, number>>({
        1: 0,
        2: 0,
        4: 0
    });
    const [isSimModalOpen, setIsSimModalOpen] = useState(false);

    const toggleDownload = (id: number) => {
        setDownloadOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-vc-teal/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Decorative Grid Background */}
            <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 tracking-tight">Application Materials</h1>
                    <p className="text-white/60 max-w-xl mx-auto">Review the requirements and study the successful examples provided to guide your submission.</p>
                </div>

                {/* Complete Example Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 glass-panel overflow-hidden border-vc-mint/20 bg-vc-mint/[0.01]"
                >
                    <div className="relative p-6 md:p-10 text-center">
                        {/* Background Glows */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-vc-mint/[0.03] to-transparent pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vc-mint/[0.03] rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                            {/* Icon & Header */}
                            <div className="space-y-4">
                                <div className="inline-flex p-2.5 rounded-xl bg-vc-mint/10 border border-vc-mint/20 shadow-lg shadow-vc-mint/5">
                                    <Rocket className="w-5 h-5 text-vc-mint" />
                                </div>
                                <div className="space-y-1.5">
                                    <h2 className="text-xl md:text-2xl font-black text-white tracking-[0.12em] uppercase font-poppins">Study a Success Case</h2>
                                    <div className="w-16 h-0.5 bg-vc-mint mx-auto rounded-full opacity-40" />
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm md:text-base text-white/60 leading-relaxed">
                                To help you craft the strongest possible submission, we've shared the full application of <strong className="text-vc-mint font-bold italic">Venture Craftee</strong>, a benchmark case study that exemplifies technical excellence and clear business logic.
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                                <a
                                    href="/venture-craftee-branded-application.html"
                                    target="_blank"
                                    className="btn-primary !px-6 !py-3 !rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-vc-mint/10 hover:scale-105 active:scale-95 transition-all text-xs w-full sm:w-auto"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="tracking-widest font-bold uppercase">Application Form Guide</span>
                                </a>
                                <button
                                    onClick={() => setIsSimModalOpen(true)}
                                    className="px-6 py-3 bg-white/5 border border-white/10 hover:border-vc-mint/50 hover:bg-white/10 text-white font-bold tracking-widest uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 group active:scale-95 w-full sm:w-auto"
                                >
                                    <Rocket className="w-4 h-4 text-vc-mint group-hover:animate-bounce" />
                                    <span>Simulate Application</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-8">
                        {applicationMaterials.map((material, idx) => {
                            const hasDocs = !!(material.content.documents && material.content.documents.length > 0);
                            const currentDocIdx = activeDoc[material.number] || 0;
                            const currentDoc = (hasDocs && material.content.documents) ? material.content.documents[currentDocIdx] : null;

                            return (
                                <div key={idx} id={material.title.toLowerCase().replace(/ /g, '-')} className="scroll-mt-32 glass-panel p-6 md:p-8 space-y-6 group hover:border-vc-mint/30 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-vc-mint/10 flex items-center justify-center text-vc-mint font-bold text-lg shrink-0">
                                                {material.number}
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-vc-mint tracking-tight uppercase">{material.title}</h3>
                                        </div>
                                        <div className="flex flex-col items-start sm:items-end gap-2 text-left sm:text-right">
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
                                                Format: {material.format}
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-vc-mint/5 border border-vc-mint/10 text-xs sm:text-sm font-bold text-vc-mint uppercase tracking-widest whitespace-nowrap">
                                                Length: {material.length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-white/80 text-base md:text-lg leading-relaxed">
                                            <strong className="text-vc-mint">Purpose:</strong> {material.purpose}
                                        </p>

                                        {material.intro && (
                                            <p className="text-white/60 text-base md:text-lg leading-relaxed italic border-l-2 border-vc-mint/30 pl-4">
                                                {material.intro}
                                            </p>
                                        )}

                                        <div className="space-y-3 bg-white/[0.02] rounded-xl p-6 border border-white/5">
                                            <h4 className="text-base font-bold text-white/40 uppercase tracking-wider">{material.content.title}</h4>
                                            {material.content.items && (
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                    {material.content.items.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-base text-white/60">
                                                            <div className="w-1 h-1 rounded-full bg-vc-mint mt-2 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {material.content.alphaItems && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                    {material.content.alphaItems.map((item, i) => (
                                                        <div key={i} className="flex items-start gap-3 text-base text-white/60">
                                                            <span className="text-vc-mint font-bold italic lowercase text-base">{String.fromCharCode(97 + i)}.</span>
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {material.content.nestedItems && (
                                                <div className="space-y-6">
                                                    {material.content.nestedItems.map((nitem, ni) => (
                                                        <div key={ni} className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-vc-mint shadow-[0_0_10px_rgba(79,209,197,0.5)]" />
                                                                <h5 className="text-lg font-bold text-white">{nitem.title}</h5>
                                                            </div>
                                                            <ul className="space-y-2 ml-4">
                                                                {nitem.subItems.map((sitem, si) => (
                                                                    <li key={si} className="text-base text-white/40 flex items-start gap-2">
                                                                        <span className="text-vc-mint/40 select-none">◦</span>
                                                                        {sitem}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {nitem.nestedNote && (
                                                                <div className="ml-4 mt-2 p-3 bg-vc-mint/5 border border-vc-mint/10 rounded-lg space-y-2">
                                                                    <p className="text-base font-bold text-vc-mint uppercase tracking-wider">{nitem.nestedNote.title}</p>
                                                                    {nitem.nestedNote.items.map((nn, nni) => (
                                                                        <p key={nni} className="text-base text-white/40 flex items-start gap-2">
                                                                            <span className="shrink-0">-</span>
                                                                            {nn}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {material.extra && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                                                <div className="space-y-4">
                                                    <h4 className="text-base font-bold text-vc-mint uppercase tracking-wider">{material.extra.title}</h4>
                                                    <ul className="space-y-2">
                                                        {material.extra.items.map((e, i) => (
                                                            <li key={i} className="text-base text-white/60 flex items-start gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-vc-mint/20 mt-1 shrink-0" />
                                                                {e}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="p-4 bg-white/[0.03] rounded-xl space-y-2 border border-white/5">
                                                        <p className="text-sm font-bold text-white/40 uppercase tracking-wider">{material.extra.formats.title}</p>
                                                        {material.extra.formats.list.map((f, i) => (
                                                            <p key={i} className="text-sm text-white/60 flex items-start gap-2">
                                                                <span className="text-vc-mint shrink-0">•</span>
                                                                {f}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <h4 className="text-base font-bold text-vc-mint uppercase tracking-wider">{material.extra.quality.title}</h4>
                                                        {material.extra.quality.list.map((q, i) => (
                                                            <p key={i} className="text-sm text-white/50 flex items-start gap-2 pl-2 border-l border-vc-mint/20">
                                                                {q}
                                                            </p>
                                                        ))}
                                                    </div>
                                                    <div className="p-4 bg-vc-mint/5 rounded-xl space-y-3 border border-vc-mint/10">
                                                        <h4 className="text-sm font-bold text-vc-mint uppercase tracking-wider">{material.extra.instructions.title}</h4>
                                                        {material.extra.instructions.list.map((ins, i) => (
                                                            <div key={i} className="flex gap-3 text-sm text-white/70">
                                                                <span className="w-4 h-4 rounded-full bg-vc-mint/10 flex items-center justify-center text-vc-mint shrink-0 text-xs">{i + 1}</span>
                                                                {ins}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {material.note && (
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start">
                                            <AlertCircle className="w-4 h-4 text-vc-mint shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-white uppercase tracking-wider">Evaluation Note</p>
                                                <p className="text-sm text-white/40 leading-relaxed italic">{material.note}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* PDF Preview Section */}
                                    {hasDocs && currentDoc && (
                                        <div className="mt-12 space-y-6 pt-8 border-t border-white/5">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="flex flex-col items-start gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-vc-mint/10 flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-vc-mint" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white uppercase tracking-wider leading-none">Resources & Samples</h4>
                                                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">Select a document to preview</p>
                                                        </div>
                                                    </div>

                                                    {/* Document Switcher (Tab-like buttons) */}
                                                    {material.content.documents && material.content.documents.length > 1 && (
                                                        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                                                            {material.content.documents.map((doc, dIdx) => (
                                                                <button
                                                                    key={dIdx}
                                                                    onClick={() => setActiveDoc(prev => ({ ...prev, [material.number]: dIdx }))}
                                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentDocIdx === dIdx
                                                                        ? 'bg-vc-mint text-[#002B28] shadow-[0_0_15px_rgba(79,209,197,0.4)]'
                                                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                                                        }`}
                                                                >
                                                                    {doc.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => toggleDownload(material.number)}
                                                            className="flex items-center gap-2 text-xs font-bold text-vc-mint hover:text-white transition-colors group bg-vc-mint/5 px-4 py-2 rounded-lg border border-vc-mint/10 shrink-0"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            DOWNLOAD
                                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${downloadOpen[material.number] ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        <AnimatePresence>
                                                            {downloadOpen[material.number] && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-40"
                                                                        onClick={() => toggleDownload(material.number)}
                                                                    />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        className="absolute right-0 mt-2 w-48 bg-[#001f1c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                                                                    >
                                                                        <div className="p-1">
                                                                            <a
                                                                                href={currentDoc.pdfUrl}
                                                                                download
                                                                                onClick={() => toggleDownload(material.number)}
                                                                                className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-vc-mint hover:bg-white/5 transition-all rounded-lg group"
                                                                            >
                                                                                <FileText className="w-4 h-4 text-vc-mint/40 group-hover:text-vc-mint" />
                                                                                {currentDoc.label.toUpperCase()} (PDF)
                                                                            </a>
                                                                            {currentDoc.pptxUrl && (
                                                                                <a
                                                                                    href={currentDoc.pptxUrl}
                                                                                    download
                                                                                    onClick={() => toggleDownload(material.number)}
                                                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-vc-mint hover:bg-white/5 transition-all rounded-lg group"
                                                                                >
                                                                                    <FileCode className="w-4 h-4 text-vc-mint/40 group-hover:text-vc-mint" />
                                                                                    {currentDoc.label.toUpperCase()} (PPTX)
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    <a
                                                        href={currentDoc.previewUrl || currentDoc.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors group bg-white/5 px-4 py-2 rounded-lg border border-white/10 shrink-0"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                        FULLSCREEN
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#001f1c] shadow-2xl glass-panel group ring-1 ring-white/5">
                                                <div className="absolute inset-0 bg-vc-mint/5 animate-pulse group-hover:opacity-0 transition-opacity" />
                                                <iframe
                                                    key={currentDoc.previewUrl || currentDoc.pdfUrl}
                                                    src={currentDoc.previewUrl || `${currentDoc.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                                    className="absolute inset-0 w-full h-full border-none transition-opacity bg-white"
                                                    title={`${material.title} Preview`}
                                                />
                                            </div>

                                            <p className="text-sm text-white/40 italic text-center px-4">
                                                {currentDoc.sublabel}. You are welcome to use this as a reference to ensure your submission meets the technical standards.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </motion.div>
            </div>
            <SimulatedApplicationModal
                isOpen={isSimModalOpen}
                onClose={() => setIsSimModalOpen(false)}
            />
            <Footer />
        </main>
    );
}
