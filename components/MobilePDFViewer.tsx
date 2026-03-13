'use client';

import { useState, useEffect } from 'react';
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

    // Dynamic width calculation to fit the modal/container perfectly
    useEffect(() => {
        const updateWidth = () => {
            // In page.tsx, the container has a max width. On mobile, we can take the full viewport minus padding.
            // The padding is roughly 2rem (32px) on mobile for the main container layout.
            const width = window.innerWidth - 32;
            setContainerWidth(width > 900 ? 900 : width);
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div className="w-full h-full overflow-y-auto bg-white flex flex-col items-center nice-scrollbar">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex flex-col items-center justify-center p-10 text-vc-mint">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="font-mono text-sm uppercase tracking-widest text-[#001412]">Loading PDF...</p>
                    </div>
                }
                className="w-full flex-col items-center shadow-lg"
            >
                {Array.from(new Array(numPages || 0), (el, index) => (
                    <div key={`page_${index + 1}`} className="mb-4 shadow-sm border-b border-gray-100 last:mb-0 w-full flex justify-center bg-white">
                        <Page
                            pageNumber={index + 1}
                            width={containerWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="w-full"
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
}
