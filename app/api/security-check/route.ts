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
                if (buffer || (fileUrl && (fileUrl.endsWith('.pdf') || fileUrl.endsWith('.doc') || fileUrl.endsWith('.docx') || fileUrl.endsWith('.png') || fileUrl.endsWith('.jpg')))) {
                    // --- FILE SCANNING LOGIC ---
                    // 1. Check if VT already knows this file
                    const vtResponse = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
                        headers: { 'x-apikey': apiKey }
                    });

                    if (vtResponse.ok) {
                        const vtData = await vtResponse.json();
                        stats = vtData.data.attributes.last_analysis_stats;
                        if (stats.malicious > 0) scanStatus = 'malicious';
                        else if (stats.suspicious > 0) scanStatus = 'suspicious';
                        else scanStatus = 'clean';
                    } else if (vtResponse.status === 404 && buffer) {
                        // Submit for scanning
                        const formData = new FormData();
                        formData.append('file', new Blob([Buffer.from(buffer)]), 'upload');
                        const submitResponse = await fetch('https://www.virustotal.com/api/v3/files', {
                            method: 'POST',
                            headers: { 'x-apikey': apiKey },
                            body: formData
                        });
                        if (submitResponse.ok) scanStatus = 'pending_submission';
                    }
                } else if (fileUrl) {
                    // --- URL SCANNING LOGIC (for social profiles, etc.) ---
                    const urlId = Buffer.from(fileUrl).toString('base64').replace(/=/g, '');
                    const vtUrlResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
                        headers: { 'x-apikey': apiKey }
                    });

                    if (vtUrlResponse.ok) {
                        const vtData = await vtUrlResponse.json();
                        stats = vtData.data.attributes.last_analysis_stats;
                        if (stats.malicious > 0) scanStatus = 'malicious';
                        else if (stats.suspicious > 0) scanStatus = 'suspicious';
                        else scanStatus = 'clean';
                    } else if (vtUrlResponse.status === 404) {
                        // Submit URL for scan
                        const submitRes = await fetch('https://www.virustotal.com/api/v3/urls', {
                            method: 'POST',
                            headers: {
                                'x-apikey': apiKey,
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: `url=${encodeURIComponent(fileUrl)}`
                        });
                        if (submitRes.ok) scanStatus = 'pending_submission';
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
