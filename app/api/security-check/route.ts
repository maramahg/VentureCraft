import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { fileUrl, hash: providedHash } = await request.json();

        if (!fileUrl && !providedHash) {
            return NextResponse.json({ error: 'File URL or Hash is required' }, { status: 400 });
        }

        let hash = providedHash;
        let buffer: any = null;

        if (fileUrl && !hash) {
            // Fetch the file to compute its hash
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch file for scanning');
            }

            buffer = await response.arrayBuffer();
            hash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');
        }

        const apiKey = process.env.VIRUSTOTAL_API_KEY?.replace(/['"]/g, '').trim();
        let scanStatus = 'unknown';
        let stats = { malicious: 0, suspicious: 0, undetected: 0, harmless: 0, timeout: 0, 'confirmed-timeout': 0, failure: 0, 'type-unsupported': 0 };

        if (apiKey) {
            try {
                // 1. Check if VT already knows this file
                const vtResponse = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
                    headers: { 'x-apikey': apiKey }
                });

                if (vtResponse.ok) {
                    const vtData = await vtResponse.json();
                    stats = vtData.data.attributes.last_analysis_stats;
                    // Differentiate between absolute safety and suspicion
                    if (stats.malicious > 0) {
                        scanStatus = 'malicious';
                    } else if (stats.suspicious > 0) {
                        scanStatus = 'suspicious';
                    } else {
                        scanStatus = 'clean';
                    }
                } else if (vtResponse.status === 404) {
                    // 2. File not seen before: Submit it for scanning if we have the buffer
                    if (buffer) {
                        console.log(`[Security] File not found on VT. Submitting for scan: ${hash}`);

                        const formData = new FormData();
                        formData.append('file', new Blob([Buffer.from(buffer)]), 'upload');

                        const submitResponse = await fetch('https://www.virustotal.com/api/v3/files', {
                            method: 'POST',
                            headers: { 'x-apikey': apiKey },
                            body: formData
                        });

                        if (submitResponse.ok) {
                            scanStatus = 'pending_submission';
                        }
                    } else {
                        // Just an integrity check with no file to upload
                        scanStatus = 'pending_submission';
                    }
                }
            } catch (vtError) {
                console.error('[Security] VT API Error:', vtError);
            }
        }

        // Construct the VirusTotal Report URL
        const reportUrl = `https://www.virustotal.com/gui/file/${hash}`;

        return NextResponse.json({
            success: true,
            hash,
            reportUrl,
            status: scanStatus,
            stats,
            provider: 'VirusTotal'
        });

    } catch (error: any) {
        console.error('Security check error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
