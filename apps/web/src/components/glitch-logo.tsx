function LogoInner() {
  return (
    <div className="flex items-center gap-3">
      <span className="font-brand text-2xl font-semibold tracking-[-0.05em]">
        O°
      </span>
      <span className="font-brand text-xl font-semibold tracking-[-0.05em]">
        Orthogonal
      </span>
    </div>
  );
}

export function GlitchLogo() {
  return <LogoInner />;
}
