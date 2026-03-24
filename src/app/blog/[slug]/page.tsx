import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, getRelatedPosts } from '@/lib/blog/posts';
import BlogCTA from '../BlogCTA';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://federalresumeai.gov';
const PUBLISHER_NAME = 'Federal Resume AI';

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Not Found' };

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | Federal Resume AI`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedDate ?? post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────

function ArticleSchema({ post }: { post: NonNullable<ReturnType<typeof getPost>> }) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.updatedDate ?? post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: SITE_URL,
    },
    keywords: post.tags.join(', '),
    articleSection: 'Federal Resume Guides',
    inLanguage: 'en-US',
  };

  const faqSchema = post.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

// ─── Related Articles ─────────────────────────────────────────────────────────

function RelatedArticles({ slugs }: { slugs: string[] }) {
  const related = getRelatedPosts(slugs);
  if (related.length === 0) return null;

  return (
    <aside className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold mb-5">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map(r => (
          <Link
            key={r.slug}
            href={`/blog/${r.slug}`}
            className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg p-4 transition-colors"
          >
            <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 leading-snug">
              {r.title}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{r.description}</p>
            <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1">
              Read article
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}

// ─── FAQ Accordion (server-rendered, CSS-only) ────────────────────────────────

function FAQSection({ faqs }: { faqs: NonNullable<ReturnType<typeof getPost>>['faqs'] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group border border-gray-200 rounded-lg overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
              <span>{faq.question}</span>
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── Article Page ─────────────────────────────────────────────────────────────

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const prevPost = allPosts.find((_, i) => allPosts[i + 1]?.slug === slug) ?? null;
  const nextPost = allPosts.find((_, i) => allPosts[i - 1]?.slug === slug) ?? null;

  return (
    <>
      <ArticleSchema post={post} />

      <div className="min-h-screen bg-white">
        {/* ── Breadcrumb + Header ── */}
        <header className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 line-clamp-1">{post.title}</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span>By <strong className="text-gray-700">{post.author}</strong></span>
              <span>·</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Description */}
            <p className="mt-4 text-lg text-gray-600 leading-relaxed border-l-4 border-blue-400 pl-4">
              {post.description}
            </p>
          </div>
        </header>

        {/* ── Article Body ── */}
        <main className="container mx-auto px-4 py-10 max-w-3xl">
          {/* Compliance callout */}
          <div className="mb-8 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
            </svg>
            <p className="text-amber-800">
              <strong>Regulatory constraint:</strong> The system never fabricates experience, never removes required qualification language, targets 950–1,050 words, and enforces a hard limit of 1,100 words per the September 27, 2025 OPM rule.
            </p>
          </div>

          {/* Inline CTA (mid-article) */}
          <BlogCTA variant="inline" />

          {/* Article HTML content */}
          <article
            className="prose prose-gray prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* FAQ Section */}
          <FAQSection faqs={post.faqs} />

          {/* Bottom CTA */}
          <BlogCTA
            variant="bottom"
            headline="Check Your Federal Resume — Right Now"
            subtext={`Apply what you just read. Our AI checks every requirement covered in this article — word count, qualification language, GS compatibility — in under 30 seconds.`}
          />

          {/* Prev / Next navigation */}
          {(prevPost || nextPost) && (
            <nav className="mt-10 border-t pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col gap-1 p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                  <span className="font-medium text-sm text-gray-900 group-hover:text-blue-700 line-clamp-2 leading-snug">
                    {prevPost.title}
                  </span>
                </Link>
              )}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col gap-1 p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors sm:text-right"
                >
                  <span className="text-xs text-gray-400 flex items-center gap-1 sm:justify-end">
                    Next
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="font-medium text-sm text-gray-900 group-hover:text-blue-700 line-clamp-2 leading-snug">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {/* Related articles */}
          <RelatedArticles slugs={post.relatedSlugs} />
        </main>
      </div>
    </>
  );
}
