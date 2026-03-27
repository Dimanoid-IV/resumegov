import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.resumegov.com';

export const metadata: Metadata = {
  title: 'Federal Resume Blog — USAJOBS Compliance & Career Guides',
  description:
    'Expert guides on federal resume compliance, GS pay grades, KSA statements, and USAJOBS application strategy. Stay current with the 2025 OPM 2-page rule.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Federal Resume Blog — USAJOBS Compliance & Career Guides',
    description:
      'Expert guides on federal resume compliance, GS pay grades, KSA statements, and USAJOBS application strategy.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

// Blog listing schema (WebPage + ItemList)
function BlogListSchema({ posts }: { posts: ReturnType<typeof getAllPosts> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Federal Resume Blog',
    url: `${SITE_URL}/blog`,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const TAG_COLORS: Record<string, string> = {
  '2-page limit': 'bg-red-50 text-red-700',
  'OPM regulation': 'bg-orange-50 text-orange-700',
  'GS levels': 'bg-blue-50 text-blue-700',
  KSA: 'bg-purple-50 text-purple-700',
  USAJOBS: 'bg-green-50 text-green-700',
  default: 'bg-gray-100 text-gray-600',
};

function TagBadge({ tag }: { tag: string }) {
  const cls = TAG_COLORS[tag] ?? TAG_COLORS.default;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{tag}</span>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <BlogListSchema posts={posts} />
      <SiteNav />

      <div className="min-h-screen bg-gray-50">
        {/* ── Page Header ── */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-10">
            <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Blog</span>
            </nav>
            <h1 className="text-4xl font-bold text-gray-900">Federal Resume Blog</h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              Expert guidance on USAJOBS compliance, GS pay grades, and federal hiring strategy — updated for the September 2025 2-page rule.
            </p>
            {/* Compliance alert */}
            <div className="mt-5 inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">
                <strong>Regulatory update:</strong> OPM 2-page federal resume limit effective September 27, 2025.
              </p>
            </div>
          </div>
        </header>

        {/* ── Post Grid ── */}
        <main className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Card header */}
                <div className="p-6 flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
                </div>

                {/* Card footer */}
                <div className="px-6 pb-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="text-xs text-gray-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="mx-1.5">·</span>
                    {post.readingTime} min read
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Read
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to optimize your federal resume?</h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Our AI checks word count compliance, qualification language, and GS-level compatibility against your specific vacancy announcement.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded hover:bg-slate-100 transition-colors"
            >
              Analyze My Resume — Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </main>
      </div>

      <SiteFooter />
    </>
  );
}
