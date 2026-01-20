export const GradientOrbs = () => {
  return (
    <>
      {/* Gradient Orbs Background */}
      <div 
        className="absolute left-[-120px] top-1/5 w-[600px] h-[600px] rounded-full pointer-events-none orb-motion orb-float-diagonal"
        style={{
          background: "radial-gradient(ellipse at center, hsl(220 90% 65% / 0.2), hsl(200 85% 60% / 0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div 
        className="absolute right-[-100px] top-1/3 w-[500px] h-[500px] rounded-full pointer-events-none orb-motion orb-float-around"
        style={{
          background: "radial-gradient(ellipse at center, hsl(240 85% 60% / 0.18), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div 
        className="absolute left-1/4 bottom-[-120px] w-[550px] h-[550px] rounded-full pointer-events-none orb-motion orb-float-up"
        style={{
          background: "radial-gradient(ellipse at center, hsl(200 90% 55% / 0.15), transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="absolute right-1/4 bottom-[-100px] w-[450px] h-[450px] rounded-full pointer-events-none orb-motion orb-float-side"
        style={{
          background: "radial-gradient(ellipse at center, hsl(210 85% 58% / 0.12), transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div 
        className="absolute left-1/2 top-1/2 w-[350px] h-[350px] rounded-full pointer-events-none orb-motion orb-float-circle"
        style={{
          background: "radial-gradient(ellipse at center, hsl(190 80% 60% / 0.14), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div 
        className="absolute left-1/2 top-[-180px] w-[420px] h-[420px] rounded-full pointer-events-none orb-motion orb-float-diagonal"
        style={{
          background: "radial-gradient(ellipse at center, hsl(210 85% 62% / 0.12), hsl(200 85% 55% / 0.1), transparent 70%)",
          filter: "blur(70px)",
          transform: "translateX(-50%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid-pattern" />
    </>
  );
};
