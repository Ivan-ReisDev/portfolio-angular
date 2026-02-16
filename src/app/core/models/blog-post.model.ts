export type BlogCategory = 'blog' | 'cheatsheet' | 'cookbook';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  author: string;
  readTime: number;
}
