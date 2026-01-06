'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap() {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Key global locations with labels
    const locations = [
        { name: 'Saudi Arabia', coordinates: [45, 24], color: '#39cc89' },
        { name: 'USA', coordinates: [-95, 37], color: '#39cc89' },
        { name: 'Europe', coordinates: [10, 50], color: '#39cc89' },
        { name: 'Asia', coordinates: [105, 30], color: '#39cc89' },
    ];

    return (
        <div
            className="relative w-full h-full min-h-[400px] flex items-center justify-center group"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
        >

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 120,
                    center: [30, 20]
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto'
                }}
            >
                <defs>
                    {/* Animated ombre gradient */}
                    <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0f2873" stopOpacity="0.9" />
                        <stop offset="33%" stopColor="#1e5a8e" stopOpacity="0.8" />
                        <stop offset="66%" stopColor="#2d8b6e" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#39cc89" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Dense, bold dot pattern */}
                    <pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.6" fill="#39cc89" opacity="0.95" />
                    </pattern>

                    {/* Glow filters */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="strongGlow">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>


                {/* Animated connection lines removed */}

                {/* Interactive continents */}
                <Geographies geography={geoUrl}>
                    {({ geographies }: any) =>
                        geographies.map((geo: any) => {
                            const isHovered = hoveredCountry === geo.properties.name;
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={isHovered ? "url(#continentGradient)" : "url(#dots)"}
                                    stroke="#39cc89"
                                    strokeWidth={isHovered ? 2 : 0.6}
                                    strokeOpacity={isHovered ? 1 : 0.7}
                                    onMouseEnter={() => {
                                        const countryName = geo.properties.name === 'Israel' ? 'Palestine' : geo.properties.name;
                                        setHoveredCountry(countryName);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredCountry(null);
                                    }}
                                    style={{
                                        default: { outline: 'none', pointerEvents: 'auto' },
                                        hover: { outline: 'none', cursor: 'pointer', pointerEvents: 'auto' },
                                        pressed: { outline: 'none', pointerEvents: 'auto' },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>

                {/* Animated location markers - Saudi Arabia only */}
                {locations.slice(0, 1).map((location, i) => (
                    <Marker key={i} coordinates={location.coordinates}>
                        {/* Saudi Arabia - simplified for performance */}
                        <g filter="url(#strongGlow)">
                            {/* Single ripple ring */}
                            <circle
                                r={8}
                                fill="none"
                                stroke="#39cc89"
                                strokeWidth={2}
                                opacity={0}
                            >
                                <animate
                                    attributeName="r"
                                    values="8;20;8"
                                    dur="3s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.8;0;0.8"
                                    dur="3s"
                                    repeatCount="indefinite"
                                />
                            </circle>

                            {/* Main marker - static, no pulsing */}
                            <circle r={7} fill="#39cc89" opacity={1} />
                        </g>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
