'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// Theme handled automatically by Tailwind dark: classes
import { ArrowLeft } from 'lucide-react'
import { concepts } from '@/data/concepts'
import { Arcade } from './Arcade'
import Image from 'next/image'

const Concepts101: React.FC = () => {
  // Theme handled automatically by Tailwind dark: classes
  const router = useRouter()
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(false)

  // Trigger entrance animation on component mount
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleImageError = (conceptId: string) => {
    setImageErrors(prev => new Set(prev).add(conceptId))
  }

  const handleBackClick = () => {
    router.push('/')
  }

  return (
    <section className="relative min-h-screen py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-all hover:scale-105 hover:bg-gray-200 hover:text-purple-600 dark:bg-slate-800/50 dark:text-gray-300 dark:hover:bg-slate-700/70 dark:hover:text-purple-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>

        {/* Header Section */}
        <div
          className={`mb-16 text-center transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 transform opacity-100' : 'translate-y-6 transform opacity-0'
          }`}
        >
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Sentry{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Concepts 101
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Master the core concepts that power Sentry Observability
          </p>
        </div>

        {/* Concepts List */}
        <div className="space-y-16">
          {concepts
            .sort((a, b) => a.order - b.order)
            .map((concept, index) => (
              <section
                key={concept.id}
                id={concept.id}
                style={{
                  transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                }}
                className={`duration-600 transform rounded-2xl border p-8 transition-all ease-out md:p-12 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } border-purple-200/30 bg-white/70 dark:border-purple-500/20 dark:bg-slate-900/50`}
              >
                <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                  {concept.order}. {concept.title}
                </h2>

                <div className="grid items-start gap-12 lg:grid-cols-2">
                  {/* Concept Description */}
                  <div className="concept-description space-y-6">
                    {concept.description.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Concept Demo */}
                  <div className="concept-demo">
                    <div className="overflow-hidden rounded-xl border border-purple-200/30 bg-gray-50/50 dark:border-purple-500/20 dark:bg-slate-800/30">
                      <div className="border-b border-purple-200/30 bg-purple-50/50 px-4 py-3 text-sm font-medium text-purple-700 dark:border-purple-500/20 dark:bg-slate-800/50 dark:text-purple-300">
                        {concept.useImage ? 'Visual Example' : 'Interactive Demo'}
                      </div>
                      <div className="p-4">
                        {concept.useImage && concept.imageUrl ? (
                          <div className="w-full">
                            {imageErrors.has(concept.id) ? (
                              <div className="p-8 text-center">
                                <div className="mb-4 text-4xl text-purple-600 dark:text-purple-400">
                                  📊
                                </div>
                                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                  {concept.title} Visualization
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Interactive diagram showing {concept.title.toLowerCase()}{' '}
                                  structure and relationships
                                </p>
                              </div>
                            ) : (
                              <Image
                                src={concept.imageUrl}
                                alt={concept.imageAlt || `${concept.title} visualization`}
                                width={800}
                                height={600}
                                className="transition-smooth h-auto w-full transform rounded-lg border border-gray-200/50 hover:scale-105 hover:border-gray-300/70 dark:border-gray-600/50 dark:hover:border-gray-500/70"
                                onError={() => handleImageError(concept.id)}
                              />
                            )}
                          </div>
                        ) : (
                          <Arcade
                            src={
                              concept.arcadeUrl ||
                              'https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true'
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
        </div>

        {/* Call to Action */}
        <div
          style={{
            transitionDelay: isVisible ? `${concepts.length * 150 + 200}ms` : '0ms',
          }}
          className={`duration-600 mt-20 transform rounded-2xl border p-12 text-center transition-all ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          } border-purple-200/50 bg-gradient-to-r from-purple-50 to-violet-50 dark:border-purple-500/30 dark:from-purple-900/20 dark:to-violet-900/20`}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to dive deeper?
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Now that you understand the core concepts, explore our hands-on courses and learning
            paths to master Sentry in practice.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => {
                router.push('/?scrollTo=courses')
              }}
              className="transform rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-3 font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-violet-700 hover:shadow-purple-500/40"
            >
              Browse Courses
            </button>
            <button
              onClick={() => {
                router.push('/?scrollTo=learning-paths')
              }}
              className="transform rounded-lg border border-purple-300 px-8 py-3 font-medium text-purple-700 transition-all duration-200 hover:scale-105 hover:bg-purple-50 dark:border-purple-400/50 dark:text-purple-300 dark:hover:bg-purple-500/10"
            >
              View Learning Paths
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Concepts101
