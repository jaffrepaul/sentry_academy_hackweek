import { Suspense } from 'react'
import Header from '@/components/Header'
import LearningPaths from '@/components/LearningPaths'
import Footer from '@/components/Footer'

export default async function LearningPathsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
          <p className="text-gray-600">
            Structured learning journeys for different roles and skill levels
          </p>
        </div>
        
        <Suspense fallback={<div>Loading learning paths...</div>}>
          <LearningPaths />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}
