import { getBlogPost, getBlogPosts, slugify } from '@/lib/source';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GrainZone2 } from '@/components/grain-zone2';
import { PanelBar } from '@/components/panel-bar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const MDX = post.body;

  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <Header />
      <main className="mx-auto max-w-3xl px-6 md:px-12 pt-28 pb-20">
        <Link
          href="/blog"
          className="terminal-text text-xs uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent mb-8 inline-block"
        >
          ← All posts
        </Link>

        <div className="border-y border-white/[0.06] overflow-hidden">
          <PanelBar label="nous::blog" meta={post.category} />

          <div className="px-6 md:px-10 py-8 md:py-10 border-b border-white/[0.06]">
            <span className="terminal-text text-[10px] uppercase tracking-[0.2em] t-sub-label">
              {post.date} · {post.author}
            </span>
            <h1 className="font-mono text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight t-section-head mt-3 mb-2">
              {post.title}
            </h1>
            <p className="t-body">{post.description}</p>
          </div>

          <article className="prose-orthogonal px-6 md:px-10 py-8 md:py-10">
            <MDX />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: slugify(post.info.path) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return { title: `${post.title} — Orthogonal`, description: post.description };
}
