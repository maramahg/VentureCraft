"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// Dynamically import react-globe.gl to avoid SSR issues
const GlobeTmpl = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

export function Globe({ className }: { className?: string }) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hexData, setHexData] = useState<any>([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Create a solid light green data URL for the globe surface
  const globeColor = "#4FD1C5";
  const [globeImageUrl, setGlobeImageUrl] = useState<string>("");

  useEffect(() => {
    // Generate solid color texture
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = globeColor;
      ctx.fillRect(0, 0, 1, 1);
      setGlobeImageUrl(canvas.toDataURL());
    }

    // Fetch GeoJSON with error handling and empty default
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        if (countries && countries.features) {
          setHexData(countries.features);
        }
      })
      .catch(err => {
        console.error("Error fetching geojson:", err);
        setHexData([]);
      });

    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        // Ensure we have a valid size, defaulting to a large size if needed
        const width = offsetWidth || 600;
        const height = offsetHeight || width;
        const size = Math.max(width, height);
        setDimensions({ width: size, height: size });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGlobeReady = () => {
    if (globeEl.current) {
      // Configuration via methods only if they exist
      try {
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.6;
          controls.enableZoom = false;
        }

        // Material tweaks - safer access
        if (typeof globeEl.current.globeMaterial === 'function') {
          const globeMaterial = globeEl.current.globeMaterial();
          if (globeMaterial) {
            globeMaterial.color = new THREE.Color(globeColor);
            globeMaterial.emissive = new THREE.Color("#00A383");
            globeMaterial.emissiveIntensity = 0.3;
            // Add specular highlights for 3D depth
            globeMaterial.shininess = 30;
            globeMaterial.specular = new THREE.Color("#ffffff");
          }
        }
      } catch (e) {
        console.warn("Globe methods not ready yet", e);
      }
    }
  };

  return (
    <div ref={containerRef} className={`${className} flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing`}>
      {/* Container ensures size is used */}
      <div style={{ width: dimensions.width, height: dimensions.height }}>
        <GlobeTmpl
          ref={globeEl}
          backgroundColor="rgba(0,0,0,0)"
          width={dimensions.width}
          height={dimensions.height}
          onGlobeReady={handleGlobeReady}

          globeImageUrl={globeImageUrl}

          showAtmosphere={true}
          atmosphereColor="#4FD1C5"
          atmosphereAltitude={0.12}

          polygonsData={hexData}
          polygonCapColor={() => "#00201D"}
          polygonSideColor={() => "rgba(0, 32, 29, 0.2)"}
          polygonStrokeColor={() => "#003833"}
          showGlobe={true}
        />
      </div>
    </div>
  );
}
