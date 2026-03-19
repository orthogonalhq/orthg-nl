import { getBlogPost, getBlogPosts, slugify } from '@/lib/source';
import { Footer } from '@/components/footer';
import { GrainZone2 } from '@/components/grain-zone2';
import { PanelBar } from '@/components/panel-bar';
import Link from 'next/link';
import Image from 'next/image';
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
      <main className="mx-auto max-w-3xl px-6 md:px-12 pt-28 pb-20">
        <Link
          href="/blog"
          className="font-mono text-label uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent mb-8 inline-block"
        >
          ← All posts
        </Link>

        <div className="border-y border-white/[0.06] bg-black/50">
          <PanelBar label="nous::blog" meta={post.category} />

          <div className={`px-6 md:px-10 py-8 md:py-10 ${post.image ? '' : 'border-b border-white/6'}`}>
            <span className="font-mono text-label uppercase tracking-[0.2em] t-meta">
              {post.date} · {post.author}
            </span>
            <h1 className="font-mono text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight t-section-head mt-3">
              {post.title}
            </h1>
          </div>

          {post.image && (
            <div className="-mx-4 md:-mx-6 my-6">
              <Image src={post.image.startsWith("/") ? post.image : `/${post.image}`} alt="" width={1536} height={640} className="w-full object-cover" />
            </div>
          )}

          <article className="prose-orthogonal px-6 md:px-10 py-8 md:py-10">
            <p>{post.description}</p>
            <hr />
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
