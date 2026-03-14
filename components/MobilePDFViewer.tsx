'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';

// Configure the worker explicitly for Next.js to avoid loading issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MobilePDFViewerProps {
    pdfUrl: string;
}

export default function MobilePDFViewer({ pdfUrl }: MobilePDFViewerProps) {
    const [numPages, setNumPages] = useState<number>();
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Dynamic width calculation using a ResizeObserver to perfectly match the card's exact width
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width } = entries[0].contentRect;
                // On iPads/Tablets, we want a tighter fit. Subtract 32px for padding.
                // Remove the 900px cap to allow fuller usage on iPad Pro landscape.
                setContainerWidth(width > 1200 ? 1100 : width - 32);
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden bg-white flex flex-col items-center nice-scrollbar py-4 relative">
            {/* Tablet/Mobile Hint */}
            <div className="absolute top-2 right-4 z-10 pointer-events-none opacity-20 hidden sm:block">
                <p className="text-[9px] font-bold text-[#001412] tracking-widest uppercase">Pinch to Zoom</p>
            </div>

            {containerWidth > 0 ? (
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center justify-center p-10 text-vc-mint">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="font-mono text-sm uppercase tracking-widest text-[#001412]">Loading PDF...</p>
                        </div>
                    }
                    className="flex flex-col items-center w-full max-w-full"
                >
                    {Array.from(new Array(numPages || 0), (el, index) => (
                        <div key={`page_${index + 1}`} className="mb-4 shadow-sm border border-gray-100 last:mb-0 w-full max-w-full flex justify-center bg-white overflow-hidden">
                            <Page
                                pageNumber={index + 1}
                                width={containerWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="bg-white flex justify-center max-w-full"
                            />
                        </div>
                    ))}
                </Document>
            ) : (
                <div className="flex flex-col items-center justify-center p-10 text-vc-mint w-full h-full min-h-[200px]">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="font-mono text-sm uppercase tracking-widest text-[#001412]">Measuring screen...</p>
                </div>
            )}
        </div>
    );
}
