import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog/posts';

const BASE_URL = 'https://www.resumegov.com';

const corePages = [
  ['', 1, 'monthly'],
  ['/start', 0.9, 'monthly'],
  ['/federal-resume-2-page-rule', 0.9, 'monthly'],
  ['/usajobs-resume-requirements', 0.9, 'monthly'],
  ['/editorial-standards', 0.7, 'monthly'],
  ['/privacy', 0.3, 'yearly'],
  ['/terms', 0.3, 'yearly'],
  ['/guides/usajobs-resume-requirements', 0.9, 'monthly'],
  ['/guides/federal-resume-word-count-calculator', 0.9, 'monthly'],
  ['/guides/federal-specialized-experience-guide', 0.9, 'monthly'],
  ['/federal-resume-examples', 0.8, 'monthly'],
  ['/federal-resume-examples/0301-administrative-officer', 0.7, 'monthly'],
  ['/federal-resume-examples/0343-management-analyst', 0.7, 'monthly'],
  ['/federal-resume-examples/0510-accountant', 0.7, 'monthly'],
  ['/federal-resume-examples/2210-it-specialist', 0.7, 'monthly'],
  ['/federal-resume-examples/gs-5', 0.7, 'monthly'],
  ['/federal-resume-examples/gs-7', 0.7, 'monthly'],
  ['/federal-resume-examples/gs-9', 0.7, 'monthly'],
  ['/federal-resume-examples/gs-11', 0.7, 'monthly'],
  ['/blog', 0.9, 'weekly'],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const generatedAt = new Date();

  const pages: MetadataRoute.Sitemap = corePages.map(([path, priority, changeFrequency]) => ({
    url: `${BASE_URL}${path}`,
    lastModified: path === '/privacy' || path === '/terms' ? new Date('2026-07-28') : generatedAt,
    changeFrequency,
    priority,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate ?? post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...pages, ...posts];
}
