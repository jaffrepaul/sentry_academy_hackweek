import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingCard from '@/components/ui/LoadingCard'
import { generateSEO } from '@/lib/seo'

// Loading fallback for concepts content
function ConceptsLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="animate-pulse bg-gray-300/50 h-8 w-64 mx-auto rounded mb-6" />
        <div className="animate-pulse bg-gray-300/50 h-4 w-96 mx-auto rounded" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} lines={3} />
        ))}
      </div>
    </div>
  )
}

// Dynamic import for Concepts101 to reduce initial bundle size
const Concepts101 = dynamic(() => import('@/components/Concepts101'), {
  loading: () => <ConceptsLoadingFallback />,
  ssr: true // Keep SSR for better SEO on educational content
})

// Static metadata
export const metadata = generateSEO({
  title: 'Concepts 101 - Core Observability Fundamentals',
  description: 'Master the core concepts that power Sentry Observability. Learn the fundamentals of error monitoring, performance tracking, and application observability through interactive examples.',
  keywords: ['Sentry concepts', 'error monitoring basics', 'observability fundamentals', 'Sentry 101', 'monitoring concepts', 'application observability guide'],
  url: '/concepts',
  type: 'article',
  section: 'Education'
})

export default function ConceptsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <Suspense fallback={<ConceptsLoadingFallback />}>
          <Concepts101 />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}

// Enable static generation
export const revalidate = 3600 // 1 hour