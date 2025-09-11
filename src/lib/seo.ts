import { Metadata } from 'next'

export const DEFAULT_SEO = {
  title: 'Sentry Academy - Master Application Observability',
  description: 'Interactive learning platform to master Sentry\'s powerful observability tools through hands-on experience and personalized learning paths.',
  keywords: ['Sentry', 'error monitoring', 'application observability', 'performance monitoring', 'session replay', 'learning platform'],
  url: 'https://sentry-academy.vercel.app',
  image: '/favicon.svg'
}

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  url?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

export function generateSEO({
  title,
  description,
  keywords,
  url,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section
}: SEOProps = {}): Metadata {
  const seoTitle = title ? `${title} | Sentry Academy` : DEFAULT_SEO.title
  const seoDescription = description || DEFAULT_SEO.description
  const seoKeywords = keywords?.length ? [...keywords, ...DEFAULT_SEO.keywords] : DEFAULT_SEO.keywords
  const seoUrl = url ? `${DEFAULT_SEO.url}${url}` : DEFAULT_SEO.url
  const seoImage = image || DEFAULT_SEO.image

  const metadata: Metadata = {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: author ? [{ name: author }] : [{ name: 'Sentry Academy' }],
    creator: 'Sentry Academy',
    publisher: 'Sentry',
    formatDetection: {
      telephone: false,
    },
    metadataBase: new URL(DEFAULT_SEO.url),
    alternates: {
      canonical: seoUrl,
    },
    openGraph: {
      type,
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: 'Sentry Academy',
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        }
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
      creator: '@getsentry',
      site: '@getsentry',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add Google Search Console verification when available
      // google: 'your-google-verification-code',
    },
  }

  return metadata
}

// Structured data generators
export function generateCourseStructuredData(course: {
  id: number
  title: string
  description: string
  instructor?: string
  duration: string
  level: string
  category: string
  rating?: number
  reviewCount?: number
  price?: number
  currency?: string
  thumbnail?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Sentry Academy',
      url: 'https://sentry-academy.vercel.app'
    },
    instructor: course.instructor ? {
      '@type': 'Person',
      name: course.instructor
    } : {
      '@type': 'Organization',
      name: 'Sentry Academy'
    },
    courseCode: course.id.toString(),
    educationalLevel: course.level,
    about: course.category,
    timeRequired: course.duration,
    ...(course.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: course.rating,
        reviewCount: course.reviewCount || 1,
        bestRating: 5
      }
    }),
    ...(course.price !== undefined && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: course.currency || 'USD',
        availability: 'https://schema.org/InStock'
      }
    }),
    ...(course.thumbnail && {
      image: course.thumbnail
    })
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sentry Academy',
    alternateName: 'Sentry Learning Platform',
    url: 'https://sentry-academy.vercel.app',
    logo: 'https://sentry-academy.vercel.app/logos/sentry-logo.svg',
    description: 'Interactive learning platform to master Sentry\'s powerful observability tools',
    sameAs: [
      'https://sentry.io',
      'https://github.com/getsentry',
      'https://twitter.com/getsentry',
      'https://www.youtube.com/@Sentry-monitoring'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://sentry.zendesk.com/hc/en-us/'
    },
    founder: {
      '@type': 'Organization',
      name: 'Sentry'
    }
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sentry Academy',
    url: 'https://sentry-academy.vercel.app',
    description: 'Interactive learning platform to master Sentry\'s powerful observability tools',
    publisher: {
      '@type': 'Organization',
      name: 'Sentry Academy'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sentry-academy.vercel.app/courses?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://sentry-academy.vercel.app${item.url}`
    }))
  }
}