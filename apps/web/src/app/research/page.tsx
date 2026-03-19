import { getResearchPapers, slugify } from '@/lib/source';
import { Footer } from '@/components/footer';
import { GrainZone2 } from '@/components/grain-zone2';
import { PanelBar } from '@/components/panel-bar';
import Link from 'next/link';
import Image from 'next/image';
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
          className="font-mono text-label uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent mb-8 inline-block"
        >
          ← Home
        </Link>
        <div className="mb-8 pr-4">
          <p className="font-mono text-label uppercase tracking-[0.2em] t-meta mb-5">
            <span className="bg-accent text-black font-normal px-0.5">&gt;</span>
            <span className="ml-1.5">Research</span>
          </p>
          <h1 className="font-mono text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight t-section-head">
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
                  <div className="min-w-0">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/4 border border-white/6 text-tag font-mono t-meta">
                      {paper.type}
                    </span>
                    <h2 className="font-mono text-title t-card-title mt-2 mb-1 group-hover:text-accent transition-colors">
                      {paper.title}
                    </h2>
                    <p className="font-mono text-body t-meta leading-relaxed max-w-xl">
                      {paper.description}
                    </p>
                    <p className="font-mono text-label t-ghost mt-2">{paper.authors.join(', ')}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-3 pt-1">
                    <span className="font-mono text-label t-meta">
                      {paper.date}
                    </span>
                    {paper.image && (
                      <Image src={paper.image.startsWith("/") ? paper.image : `/${paper.image}`} alt="" width={192} height={128} className="w-24 h-16 object-cover rounded border border-white/6" />
                    )}
                  </div>
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
