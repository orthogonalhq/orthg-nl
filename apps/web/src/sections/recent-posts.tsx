import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { getBlogPosts, getResearchPapers, slugify } from "@/lib/source";
import Link from "next/link";

interface FeedItem {
  type: "blog" | "research";
  label: string;
  title: string;
  description: string;
  date: string;
  href: string;
  path: string;
}

export function RecentPosts() {
  const blogItems: FeedItem[] = getBlogPosts().map((post) => ({
    type: "blog",
    label: post.category,
    title: post.title,
    description: post.description,
    date: post.date,
    href: `/blog/${slugify(post.info.path)}`,
    path: post.info.path,
  }));

  const researchItems: FeedItem[] = getResearchPapers().map((paper) => ({
    type: "research",
    label: paper.type,
    title: paper.title,
    description: paper.description,
    date: paper.date,
    href: `/research/${slugify(paper.info.path)}`,
    path: paper.info.path,
  }));

  const items = [...blogItems, ...researchItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section id="latest" className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Latest">
            Latest from Orthogonal.
          </SectionHeader>
        </Reveal>

        <div className="bg-black/10 backdrop-blur-xl">
        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            <PanelBar label="nous::feed" meta="Recent" />

            <div className="divide-y divide-white/[0.06]">
              {items.map((item) => (
                <Link
                  key={item.path}
                  href={item.href}
                  className="group block px-6 md:px-10 py-6 md:py-8 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="terminal-text text-label uppercase tracking-[0.2em] t-sub-label">
                        {item.type} · {item.label}
                      </span>
                      <h3 className="terminal-text text-title t-card-title mt-2 mb-1 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="terminal-text text-body t-card-desc leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
                    <span className="terminal-text text-label t-faint shrink-0 pt-5">
                      {item.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="px-6 md:px-10 py-4 border-t border-white/[0.06] flex items-center gap-6">
              <Link
                href="/blog"
                className="terminal-text text-xs uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
              >
                Blog →
              </Link>
              <Link
                href="/research"
                className="terminal-text text-xs uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
              >
                Research →
              </Link>
            </div>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
