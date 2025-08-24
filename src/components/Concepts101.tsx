import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Arcade } from './Arcade';
import { concepts } from '../data/concepts';

const Concepts101: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (conceptId: string) => {
    setImageErrors(prev => new Set(prev).add(conceptId));
  };

  return (
    <section className="py-20 lg:py-32 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={`text-3xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Sentry{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Concepts 101
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Master the core concepts that power Sentry Observability
          </p>
        </div>

        {/* Concepts List */}
        <div className="space-y-16">
          {concepts
            .sort((a, b) => a.order - b.order)
            .map((concept) => (
              <section 
                key={concept.id} 
                id={concept.id}
                className={`rounded-2xl p-8 md:p-12 border transition-all duration-300 hover:shadow-lg ${
                  isDark 
                    ? 'bg-slate-900/50 border-purple-500/20 hover:border-purple-400/30' 
                    : 'bg-white/70 border-purple-200/30 hover:border-purple-300/50'
                }`}
              >
                <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {concept.order}. {concept.title}
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Concept Description */}
                  <div className="concept-description space-y-6">
                    {concept.description.map((paragraph, index) => (
                      <p 
                        key={index}
                        className={`text-lg leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* Concept Demo */}
                  <div className="concept-demo">
                    <div className={`rounded-xl overflow-hidden border ${
                      isDark 
                        ? 'border-purple-500/20 bg-slate-800/30' 
                        : 'border-purple-200/30 bg-gray-50/50'
                    }`}>
                      <div className={`px-4 py-3 border-b text-sm font-medium ${
                        isDark 
                          ? 'border-purple-500/20 text-purple-300 bg-slate-800/50' 
                          : 'border-purple-200/30 text-purple-700 bg-purple-50/50'
                      }`}>
                        {concept.useImage ? 'Visual Example' : 'Interactive Demo'}
                      </div>
                      <div className="p-4">
                        {concept.useImage && concept.imageUrl ? (
                          <div className="w-full">
                            {imageErrors.has(concept.id) ? (
                              // Fallback content when image fails to load
                              <div className={`w-full h-64 rounded-lg border flex items-center justify-center ${
                                isDark 
                                  ? 'border-gray-600/50 bg-slate-800/30' 
                                  : 'border-gray-200/50 bg-gray-50'
                              }`}>
                                <div className="text-center p-8">
                                  <div className={`text-4xl mb-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    📊
                                  </div>
                                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {concept.title} Visualization
                                  </h4>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Interactive diagram showing {concept.title.toLowerCase()} structure and relationships
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={concept.imageUrl}
                                alt={concept.imageAlt || `${concept.title} visualization`}
                                className={`w-full h-auto rounded-lg border transition-all duration-200 hover:scale-105 ${
                                  isDark 
                                    ? 'border-gray-600/50 hover:border-gray-500/70' 
                                    : 'border-gray-200/50 hover:border-gray-300/70'
                                }`}
                                loading="lazy"
                                onError={() => handleImageError(concept.id)}
                              />
                            )}
                          </div>
                        ) : (
                          <Arcade src={concept.arcadeUrl || "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true"} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
        </div>

        {/* Call to Action */}
        <div className={`mt-20 text-center p-12 rounded-2xl border ${
          isDark 
            ? 'bg-gradient-to-r from-purple-900/20 to-violet-900/20 border-purple-500/30' 
            : 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200/50'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to dive deeper?
          </h2>
          <p className={`text-lg mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Now that you understand the core concepts, explore our hands-on courses 
            and learning paths to master Sentry in practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                navigate('/', { state: { scrollToSection: 'courses' } });
              }}
              className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              Browse Courses
            </button>
            <button 
              onClick={() => {
                navigate('/', { state: { scrollToSection: 'learning-path' } });
              }}
              className={`px-8 py-3 rounded-lg font-medium border transition-all duration-200 transform hover:scale-105 ${
                isDark
                  ? 'border-purple-400/50 text-purple-300 hover:bg-purple-500/10'
                  : 'border-purple-300 text-purple-700 hover:bg-purple-50'
              }`}
            >
              View Learning Paths
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Concepts101;