import { getResearchPaper, getResearchPapers, slugify } from '@/lib/source';
import { Footer } from '@/components/footer';
import { GrainZone2 } from '@/components/grain-zone2';
import { PanelBar } from '@/components/panel-bar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Callout } from '@/components/callout';
import type { Metadata } from 'next';

export default async function ResearchPaper(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const paper = getResearchPaper(slug);
  if (!paper) notFound();

  const MDX = paper.body;

  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <main className="mx-auto max-w-3xl px-6 md:px-12 pt-28 pb-20">
        <Link
          href="/research"
          className="font-mono text-[10px] uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent mb-8 inline-block"
        >
          ← All papers
        </Link>

        <div className="border-y border-white/[0.06] overflow-hidden bg-black/50">
          <PanelBar label="nous::research" meta={paper.type} />

          <div className="px-6 md:px-10 py-8 md:py-10 border-b border-white/[0.06]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] t-meta">
              {paper.date} · {paper.authors.join(', ')}
            </span>
            <h1 className="font-mono text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight t-section-head mt-3">
              {paper.title}
            </h1>
          </div>

          <article className="prose-orthogonal px-6 md:px-10 py-8 md:py-10">
            <h2 className="mt-0!">Abstract</h2>
            <p>{paper.abstract}</p>
            <hr />
            <MDX components={{ Callout }} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return getResearchPapers().map((paper) => ({ slug: slugify(paper.info.path) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const paper = getResearchPaper(slug);
  if (!paper) notFound();
  return { title: `${paper.title} — Orthogonal`, description: paper.description };
}
