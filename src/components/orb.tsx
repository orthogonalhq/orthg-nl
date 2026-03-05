interface OrbProps {
  variant?: "hero" | "cortex" | "memory" | "subcortex" | "autonomic" | "background";
  className?: string;
}

export function Orb({ variant = "hero", className = "" }: OrbProps) {
  switch (variant) {
    case "cortex":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[radial-gradient(circle,rgba(250,93,43,0.25)_0%,rgba(250,93,43,0.08)_35%,transparent_65%)] shadow-[0_0_80px_25px_rgba(250,93,43,0.12)] animate-[pulse-glow_6s_ease-in-out_infinite]" />
          {/* Concentric rings */}
          <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-accent/10 animate-[pulse-glow_6s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />
          <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-accent/5 animate-[pulse-glow_6s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />
        </div>
      );

    case "memory":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="w-72 h-28 md:w-96 md:h-36 rounded-full bg-[radial-gradient(ellipse,rgba(250,93,43,0.2)_0%,rgba(250,93,43,0.06)_40%,transparent_70%)] shadow-[0_0_60px_20px_rgba(250,93,43,0.08)] animate-[drift_20s_ease-in-out_infinite] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        </div>
      );

    case "subcortex":
      return (
        <div className={`relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 ${className}`}>
          {[
            { x: "45%", y: "30%", size: "w-12 h-12 md:w-16 md:h-16", delay: "0s" },
            { x: "25%", y: "55%", size: "w-10 h-10 md:w-14 md:h-14", delay: "0.5s" },
            { x: "60%", y: "60%", size: "w-14 h-14 md:w-18 md:h-18", delay: "1s" },
            { x: "40%", y: "70%", size: "w-8 h-8 md:w-12 md:h-12", delay: "1.5s" },
            { x: "65%", y: "35%", size: "w-10 h-10 md:w-14 md:h-14", delay: "2s" },
            { x: "30%", y: "40%", size: "w-6 h-6 md:w-10 md:h-10", delay: "2.5s" },
          ].map((dot, i) => (
            <div
              key={i}
              className={`absolute ${dot.size} rounded-full bg-[radial-gradient(circle,rgba(250,93,43,0.2)_0%,rgba(250,93,43,0.05)_50%,transparent_70%)] shadow-[0_0_20px_5px_rgba(250,93,43,0.06)] animate-[pulse-glow_4s_ease-in-out_infinite]`}
              style={{ left: dot.x, top: dot.y, animationDelay: dot.delay }}
            />
          ))}
        </div>
      );

    case "autonomic":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-[radial-gradient(circle,rgba(250,93,43,0.08)_0%,rgba(250,93,43,0.02)_40%,transparent_65%)] shadow-[0_0_50px_15px_rgba(250,93,43,0.04)] animate-[pulse-glow_12s_ease-in-out_infinite]" />
        </div>
      );

    case "background":
      return (
        <div className={`pointer-events-none ${className}`}>
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(250,93,43,0.12)_0%,rgba(250,93,43,0.04)_30%,transparent_60%)] animate-[pulse-glow_10s_ease-in-out_infinite]" />
        </div>
      );

    case "hero":
    default:
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <div className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full bg-[radial-gradient(circle,rgba(250,93,43,0.2)_0%,rgba(250,142,46,0.08)_30%,transparent_65%)] shadow-[0_0_100px_30px_rgba(250,93,43,0.1)] animate-[drift_20s_ease-in-out_infinite]" />
          <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] rounded-full border border-accent/[0.07] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        </div>
      );
  }
}
