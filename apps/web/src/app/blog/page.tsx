import { getBlogPosts, slugify } from '@/lib/source';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GrainZone2 } from '@/components/grain-zone2';
import { PanelBar } from '@/components/panel-bar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Orthogonal',
  description: 'Announcements, product updates, and perspectives on sovereign AI.',
};

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <Header />
      <main className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20 pt-28 pb-20">
        <Link
          href="/"
          className="terminal-text text-xs uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent mb-8 inline-block"
        >
          ← Home
        </Link>
        <div className="mb-8 pr-4">
          <span className="terminal-text text-[10px] uppercase tracking-[0.2em] t-sub-label">Blog</span>
          <h1 className="font-mono text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight t-section-head mt-2">
            Announcements, product updates,
            <br />
            and founder perspectives.
          </h1>
        </div>

        <div className="border-y border-white/[0.06] overflow-hidden">
          <PanelBar label="nous::blog" meta={`${posts.length} Post${posts.length !== 1 ? 's' : ''}`} />

          <div className="divide-y divide-white/[0.06]">
            {posts.map((post) => (
              <Link
                key={post.info.path}
                href={`/blog/${slugify(post.info.path)}`}
                className="group block px-6 md:px-10 py-6 md:py-8 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="terminal-text text-[10px] uppercase tracking-[0.2em] t-sub-label">
                      {post.category}
                    </span>
                    <h2 className="terminal-text text-sm t-card-title mt-2 mb-1 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="terminal-text text-xs t-card-desc leading-relaxed max-w-xl">
                      {post.description}
                    </p>
                  </div>
                  <span className="terminal-text text-[10px] t-faint shrink-0 pt-5">
                    {post.date}
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
