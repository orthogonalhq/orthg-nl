import { getResearchPapers, slugify } from '@/lib/source';
import { Footer } from '@/components/footer';
import { GrainZone2 } from '@/components/grain-zone2';
import { PanelBar } from '@/components/panel-bar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research — Orthogonal',
  description: 'Technical publications, specs, and architecture papers.',
};

export default function ResearchIndex() {
  const papers = getResearchPapers();

  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <main className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20 pt-28 pb-20">
        <Link
          href="/"
          className="terminal-text text-xs uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent mb-8 inline-block"
        >
          ← Home
        </Link>
        <div className="mb-8 pr-4">
          <span className="terminal-text text-[10px] uppercase tracking-[0.2em] t-sub-label">Research</span>
          <h1 className="font-mono text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight t-section-head mt-2">
            Technical publications, specs,
            <br />
            and architecture papers.
          </h1>
        </div>

        <div className="border-y border-white/[0.06] bg-black/10 backdrop-blur-xl overflow-hidden">
          <PanelBar label="nous::research" meta={`${papers.length} Paper${papers.length !== 1 ? 's' : ''}`} />

          <div className="divide-y divide-white/[0.06]">
            {papers.map((paper) => (
              <Link
                key={paper.info.path}
                href={`/research/${slugify(paper.info.path)}`}
                className="group block px-6 md:px-10 py-6 md:py-8 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="terminal-text text-[10px] uppercase tracking-[0.2em] t-sub-label">
                      {paper.type}
                    </span>
                    <h2 className="terminal-text text-sm t-card-title mt-2 mb-1 group-hover:text-accent transition-colors">
                      {paper.title}
                    </h2>
                    <p className="terminal-text text-xs t-card-desc leading-relaxed max-w-xl">
                      {paper.abstract}
                    </p>
                    <p className="terminal-text text-[10px] t-ghost mt-2">{paper.authors.join(', ')}</p>
                  </div>
                  <span className="terminal-text text-[10px] t-faint shrink-0 pt-5">
                    {paper.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
