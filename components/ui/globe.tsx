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
  const [globeImageUrl, setGlobeImageUrl] = useState<string>("");

  const GLOBE_COLOR = "#4FD1C5";

  useEffect(() => {
    // Generate solid color texture
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = GLOBE_COLOR;
      ctx.fillRect(0, 0, 1, 1);
      setGlobeImageUrl(canvas.toDataURL());
    }

    // Fetch GeoJSON for countries
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        if (countries && countries.features) {
          setHexData(countries.features);
        }
      })
      .catch(err => console.error(err));

    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        const size = Math.min(offsetWidth || 600, offsetHeight || 600);
        setDimensions({ width: size, height: size });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGlobeReady = () => {
    if (globeEl.current) {
      try {
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.8;
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.enableRotate = true;
        }

        const globeMaterial = globeEl.current.globeMaterial();
        if (globeMaterial) {
          globeMaterial.color = new THREE.Color(GLOBE_COLOR);
          globeMaterial.emissive = new THREE.Color("#00A383");
          globeMaterial.emissiveIntensity = 0.3;
          globeMaterial.shininess = 30;
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div ref={containerRef} className={`${className} flex items-center justify-center cursor-default`}>
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
          rendererConfig={{ antialias: true, alpha: true }}
        />
      </div>
    </div>
  );
}
