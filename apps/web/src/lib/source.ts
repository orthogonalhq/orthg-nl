import { blog, research } from 'collections/server';

export function slugify(path: string) {
  return path.replace(/\.mdx?$/, '');
}

export function getBlogPosts() {
  return [...blog]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string) {
  return blog.find((post) => slugify(post.info.path) === slug);
}

export function getResearchPapers() {
  return [...research]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getResearchPaper(slug: string) {
  return research.find((paper) => slugify(paper.info.path) === slug);
}
