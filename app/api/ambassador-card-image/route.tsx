import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name') || 'Ambassador';

        // Reading the template from public folder
        const imagePath = path.join(process.cwd(), 'public', 'ambassador-card.png');
        if (!fs.existsSync(imagePath)) {
            console.error('Template image not found');
        }
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        // Robust font fetching with fallback
        let fontData: ArrayBuffer | null = null;
        try {
            const fontUrl = 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf';
            const response = await fetch(fontUrl);
            if (response.ok) {
                fontData = await response.arrayBuffer();
            } else {
                console.warn('Failed to fetch Poppins font, falling back to system font');
            }
        } catch (fontErr) {
            console.error('Font fetch error:', fontErr);
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        position: 'relative',
                        backgroundColor: '#001311',
                    }}
                >
                    {/* Background template */}
                    <img
                        src={base64Image}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'fill',
                        }}
                    />

                    {/* Centered name - vertically below center */}
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: name.length > 25 ? '480px' : '460px',
                            left: 0,
                            padding: '0 80px', // Prevent name from touching edges
                        }}
                    >
                        <h1
                            style={{
                                fontSize: name.length <= 15 ? 84 :
                                    name.length <= 25 ? 64 :
                                        name.length <= 35 ? 48 : 38,
                                fontWeight: 700,
                                color: '#ffffff',
                                margin: 0,
                                letterSpacing: '-1.5px',
                                fontFamily: fontData ? 'Poppins' : 'sans-serif',
                                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                                lineHeight: 1.1,
                            }}
                        >
                            {name}
                        </h1>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 800,
                fonts: fontData ? [
                    {
                        name: 'Poppins',
                        data: fontData,
                        weight: 700,
                        style: 'normal',
                    },
                ] : [],
            }
        );
    } catch (e: any) {
        console.error('Image generation error:', e.message);
        return new Response(`Failed to generate the image: ${e.message}`, {
            status: 500,
        });
    }
}
