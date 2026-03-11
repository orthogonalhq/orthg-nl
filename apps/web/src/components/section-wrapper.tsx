interface SectionWrapperProps {
  id: string;
  className?: string;
  fullHeight?: boolean;
  narrow?: boolean;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  className = "",
  fullHeight = false,
  narrow = false,
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative px-6 md:px-12 lg:px-20 ${
        fullHeight
          ? "flex min-h-svh flex-col items-center justify-center py-12"
          : "py-24 md:py-32"
      } ${className}`}
    >
      <div className={`mx-auto w-full ${narrow ? "max-w-2xl" : "max-w-6xl"}`}>
        {children}
      </div>
    </section>
  );
}
