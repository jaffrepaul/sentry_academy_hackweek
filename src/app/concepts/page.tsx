import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Concepts101 from '@/components/Concepts101'

export default function ConceptsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <Concepts101 />
      </main>
      
      <Footer />
    </div>
  )
}

export const metadata = {
  title: 'Concepts 101 | Sentry Academy',
  description: 'Master the core concepts that power Sentry Observability',
}
