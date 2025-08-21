import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Trophy, Star, CheckCircle, Circle, Code, FileText, Lightbulb, Users, Monitor, Github, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../contexts/RoleContext';
import { getTextClasses } from '../utils/styles';
import { courseModules, sentryFundamentalsModules, sentryLoggingModules, courses } from '../data/courses';
import { Arcade } from './Arcade';

interface ContentModuleProps {
  title: string;
  description: string;
  duration: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

const ContentModule: React.FC<ContentModuleProps> = memo(({ 
  title, 
  description, 
  duration, 
  isCompleted = false, 
  isActive = false,
  onClick 
}) => {
  const { isDark } = useTheme();

  const cardClasses = useMemo(() => {
    if (isActive) {
      return isDark 
        ? 'border-purple-400/80 bg-slate-900/80 shadow-lg shadow-purple-500/25'
        : 'border-purple-400/80 bg-white/80 shadow-lg shadow-purple-300/25';
    }
    return isDark
      ? 'border-purple-500/30 bg-slate-900/40 hover:border-purple-400/60 hover:bg-slate-900/60'
      : 'border-purple-300/30 bg-white/60 hover:border-purple-400/60 hover:bg-white/80';
  }, [isDark, isActive]);

  return (
    <div 
      className={`cursor-pointer transition-all duration-300 ${
        isActive ? 'transform scale-105' : 'hover:transform hover:scale-102'
      }`}
      onClick={onClick}
    >
      <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${cardClasses}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Circle className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
            <h3 className={`text-lg font-bold ${getTextClasses(isDark, 'primary')}`}>
              {title}
            </h3>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getTextClasses(isDark, 'secondary')}`}>
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <p className={getTextClasses(isDark, 'secondary')}>
          {description}
        </p>
      </div>
    </div>
  );
});

ContentModule.displayName = 'ContentModule';

const CourseDetail: React.FC = memo(() => {
  const { isDark } = useTheme();
  const { userProgress, completeModule, getNextRecommendation } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId: string }>();
  const [activeModule, setActiveModule] = useState(0);

  const nextRecommendation = getNextRecommendation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determine which modules and course info to use based on courseId
  const { modules, courseInfo, contentConfig } = useMemo(() => {
    const course = courses.find(c => c.id === courseId);
    
    if (courseId === 'sentry-fundamentals') {
      return {
        modules: sentryFundamentalsModules,
        courseInfo: course || courses[0],
        contentConfig: {
          videoUrl: "https://www.youtube.com/embed/6NuusWkjvlw",
          arcadeUrl: "https://demo.arcade.software/4z9l5xNZfpXFGAFc03az?embed",
          keyTakeaways: [
            "Automatic error detection and exception tracking across your application",
            "Performance monitoring with distributed tracing and custom spans",
            "Session replay captures user interactions to debug issues faster",
            "User feedback widgets collect context directly from affected users"
          ],
          scenario: {
            title: "Critical Production Bug Hunt",
            description: "Your e-commerce app suddenly experiences a 40% drop in conversions. Users report the checkout button \"doesn't work\" but traditional monitoring shows no obvious errors or server issues.",
            solution: "Sentry's monitoring stack reveals the full picture: Session Replay shows repeated checkout clicks, error monitoring catches JavaScript exceptions, performance monitoring identifies slow APIs, and user feedback confirms \"loading forever\" experiences.",
            result: "Instead of hours of guesswork, you identify and fix the root cause in 15 minutes, preventing thousands in lost revenue and customer frustration."
          },
          codeExample: {
            title: "Next.js Sentry Setup",
            filename: "instrumentation-client.ts",
            code: `import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",

  sendDefaultPii: true,

  integrations: [
    // Performance monitoring
    Sentry.browserTracingIntegration(),
    // Session replay
    Sentry.replayIntegration(),
    // User feedback
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],

  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});`
          }
        }
      };
    } else if (courseId === 'react-error-boundaries') {
      return {
        modules: sentryLoggingModules,
        courseInfo: course || courses[1],
        contentConfig: {
          videoUrl: "https://www.youtube.com/embed/06_whBhgPB0",
          arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
          keyTakeaways: [
            "Structured logs provide context beyond just errors",
            "Sentry.logger API supports multiple log levels and attributes", 
            "Logs can be searched, filtered, and used for alerts"
          ],
          scenario: {
            title: "E-commerce Checkout Process",
            description: "Your online store processes hundreds of orders daily. When payment processing starts failing intermittently, traditional logs only show generic \"payment failed\" messages without context.",
            solution: "With Sentry structured logging: You can capture user ID, cart value, payment method, and session state. This allows you to quickly identify that the issue only affects credit card payments over $500 for users in specific regions.",
            result: "What would have taken hours of investigation now takes minutes, preventing revenue loss and improving customer experience."
          },
          codeExample: {
            title: "Sentry Logging Setup",
            filename: "sentry.client.config.ts",
            code: `import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';

Sentry.init({
  dsn: '<Your Sentry DSN>',
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  // Enable logs to be sent to Sentry
  _experiments: {
    enableLogs: true,
  },
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost:3001'],
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});`
          }
        }
      };
    }
    
    // Default fallback
    return {
      modules: courseModules,
      courseInfo: course || courses[0],
      contentConfig: {
        videoUrl: "https://www.youtube.com/embed/6NuusWkjvlw",
        arcadeUrl: "https://demo.arcade.software/4z9l5xNZfpXFGAFc03az?embed",
        keyTakeaways: [
          "Automatic error detection and exception tracking across your application",
          "Performance monitoring with distributed tracing and custom spans", 
          "Session replay captures user interactions to debug issues faster",
          "User feedback widgets collect context directly from affected users"
        ],
        scenario: {
          title: "Critical Production Bug Hunt",
          description: "Your e-commerce app suddenly experiences a 40% drop in conversions. Users report the checkout button \"doesn't work\" but traditional monitoring shows no obvious errors or server issues.",
          solution: "Sentry's monitoring stack reveals the full picture: Session Replay shows repeated checkout clicks, error monitoring catches JavaScript exceptions, performance monitoring identifies slow APIs, and user feedback confirms \"loading forever\" experiences.",
          result: "Instead of hours of guesswork, you identify and fix the root cause in 15 minutes, preventing thousands in lost revenue and customer frustration."
        },
        codeExample: {
          title: "Next.js Sentry Setup",
          filename: "instrumentation-client.ts",
          code: `import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",

  sendDefaultPii: true,

  integrations: [
    // Performance monitoring
    Sentry.browserTracingIntegration(),
    // Session replay
    Sentry.replayIntegration(),
    // User feedback
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],

  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});`
        }
      }
    };
  }, [courseId]);

  const goBack = useCallback(() => {
    navigate('/');
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      // Check if user came from learning paths
      const fromLearningPaths = location.state?.from === 'learning-paths';
      const targetSection = fromLearningPaths ? 'paths' : 'courses';
      const section = document.getElementById(targetSection);
      if (section) {
        section.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, [navigate, location.state]);

  const handleModuleClick = useCallback((index: number) => {
    setActiveModule(index);
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveModule(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveModule(prev => Math.min(modules.length - 1, prev + 1));
  }, [modules.length]);

  const handleCompleteModule = useCallback(() => {
    if (courseId) {
      completeModule(courseId);
    }
  }, [courseId, completeModule]);



  const currentModule = useMemo(() => modules[activeModule], [modules, activeModule]);
  
  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark]);
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={goBack}
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 hover:shadow-purple-500/20'
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900 border border-purple-300/30 hover:border-purple-400/60 hover:shadow-purple-300/20'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${titleClasses}`}>
              {courseInfo.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm ${subtitleClasses}`}>4.9</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${subtitleClasses}`}>
                <Users className="w-4 h-4" />
                <span>12,500 students</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${subtitleClasses}`}>
                <Trophy className="w-4 h-4" />
                <span>Beginner</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Modules Sidebar */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-slate-900/40 border-purple-500/30'
                : 'bg-white/60 border-purple-300/30'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Content Modules
              </h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <ContentModule
                    key={index}
                    title={module.title}
                    description={module.description}
                    duration={module.duration}
                    isCompleted={module.isCompleted}
                    isActive={activeModule === index}
                    onClick={() => handleModuleClick(index)}
                  />
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-purple-500/20">
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Progress: 2 of 5 completed
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className={`backdrop-blur-sm border rounded-2xl p-8 ${
              isDark 
                ? 'bg-slate-900/40 border-purple-500/30'
                : 'bg-white/60 border-purple-300/30'
            }`}>
              {/* Video/Content Player */}
              <div className={`aspect-video rounded-xl mb-8 overflow-hidden ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
              }`}>
                <iframe
                  width="100%"
                  height="100%"
                  src={contentConfig.videoUrl}
                  title={`${courseInfo.title} - Demo`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>

              {/* Module Content */}
              <div className="space-y-6">
                <div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentModule.title}
                  </h3>
                  <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentModule.description}
                  </p>
                </div>



                {/* Key Concepts */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-purple-500/30 bg-slate-800/30'
                    : 'border-purple-300/30 bg-purple-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Key Takeaways
                    </h4>
                  </div>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {contentConfig.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real World Scenario */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-green-500/30 bg-green-900/10'
                    : 'border-green-300/30 bg-green-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-green-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Real World Scenario
                    </h4>
                  </div>
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}>
                    <div className={`p-4 rounded-lg ${
                      isDark ? 'bg-slate-800/30' : 'bg-white/50'
                    }`}>
                      <h5 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {contentConfig.scenario.title}
                      </h5>
                      <p className="mb-3">
                        {contentConfig.scenario.description}
                      </p>
                      <div className={`p-3 rounded border-l-4 border-green-400 ${
                        isDark ? 'bg-green-900/20' : 'bg-green-50'
                      }`}>
                        <p className="text-sm">
                          <strong>{contentConfig.scenario.solution.split(':')[0]}:</strong> {contentConfig.scenario.solution.split(':').slice(1).join(':')}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <strong>Result:</strong> {contentConfig.scenario.result}
                    </div>
                  </div>
                </div>

                {/* Code Example */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-purple-500/30 bg-slate-800/30'
                    : 'border-purple-300/30 bg-gray-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {contentConfig.codeExample.title}
                    </h4>
                  </div>
                  <div className={`rounded-lg p-4 font-mono text-sm ${
                    isDark ? 'bg-slate-900/50 text-green-400' : 'bg-white/50 text-green-600'
                  }`}>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>// {contentConfig.codeExample.filename}</div>
                    {/* Syntax-highlighted code for Sentry Fundamentals */}
                    {courseId === 'sentry-fundamentals' ? (
                      <>
                        <div><span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>import</span> * <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>as</span> Sentry <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>from</span> <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>"@sentry/nextjs"</span>;</div>
                        <br />
                        <div><span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Sentry.init</span>({'{'}</div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>dsn</span>: <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>"https://examplePublicKey@o0.ingest.sentry.io/0"</span>,
                        </div>
                        <br />
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>sendDefaultPii</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>true</span>,
                        </div>
                        <br />
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>integrations</span>: [
                        </div>
                        <div className="ml-4">
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>// Performance monitoring</span>
                        </div>
                        <div className="ml-4">Sentry.browserTracingIntegration(),</div>
                        <div className="ml-4">
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>// Session replay</span>
                        </div>
                        <div className="ml-4">Sentry.replayIntegration(),</div>
                        <div className="ml-4">
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>// User feedback</span>
                        </div>
                        <div className="ml-4">Sentry.feedbackIntegration({'{'}</div>
                        <div className="ml-6">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>colorScheme</span>: <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>"system"</span>,
                        </div>
                        <div className="ml-4">{'}'}),</div>
                        <div className="ml-2">],</div>
                        <br />
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>tracesSampleRate</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1.0</span>,
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>replaysSessionSampleRate</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>0.1</span>,
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>replaysOnErrorSampleRate</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1.0</span>,
                        </div>
                        <div>{'}'});</div>
                      </>
                    ) : courseId === 'react-error-boundaries' ? (
                      <>
                        <div><span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>import</span> * <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>as</span> Sentry <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>from</span> <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>'@sentry/react'</span>;</div>
                        <div><span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>import</span> {'{'} useEffect {'}'} <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>from</span> <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>'react'</span>;</div>
                        <div><span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>import</span> {'{'}</div>
                        <div className="ml-2">useLocation,</div>
                        <div className="ml-2">useNavigationType,</div>
                        <div className="ml-2">createRoutesFromChildren,</div>
                        <div className="ml-2">matchRoutes,</div>
                        <div>{'}'} <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>from</span> <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>'react-router-dom'</span>;</div>
                        <br />
                        <div><span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Sentry.init</span>({'{'}</div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>dsn</span>: <span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>'&lt;Your Sentry DSN&gt;'</span>,
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>sendDefaultPii</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>true</span>,
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>integrations</span>: [
                        </div>
                        <div className="ml-4">Sentry.browserTracingIntegration(),</div>
                        <div className="ml-4">Sentry.replayIntegration(),</div>
                        <div className="ml-4">Sentry.reactRouterV7BrowserTracingIntegration({'{'}</div>
                        <div className="ml-6">useEffect: useEffect,</div>
                        <div className="ml-6">useLocation,</div>
                        <div className="ml-6">useNavigationType,</div>
                        <div className="ml-6">createRoutesFromChildren,</div>
                        <div className="ml-6">matchRoutes,</div>
                        <div className="ml-4">{'}'}),</div>
                        <div className="ml-2">],</div>
                        <div className={`ml-2 ${isDark ? 'bg-yellow-400/20 border-l-4 border-yellow-400' : 'bg-yellow-200/30 border-l-4 border-yellow-500'}`}>
                          <div className="pl-2">
                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>// Enable logs to be sent to Sentry</span>
                          </div>
                        </div>
                        <div className={`ml-2 ${isDark ? 'bg-yellow-400/20 border-l-4 border-yellow-400' : 'bg-yellow-200/30 border-l-4 border-yellow-500'}`}>
                          <div className="pl-2">
                            <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>_experiments</span>: {'{'}
                          </div>
                        </div>
                        <div className={`ml-2 ${isDark ? 'bg-yellow-400/20 border-l-4 border-yellow-400' : 'bg-yellow-200/30 border-l-4 border-yellow-500'}`}>
                          <div className="ml-2 pl-2">
                            <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>enableLogs</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>true</span>,
                          </div>
                        </div>
                        <div className={`ml-2 ${isDark ? 'bg-yellow-400/20 border-l-4 border-yellow-400' : 'bg-yellow-200/30 border-l-4 border-yellow-500'}`}>
                          <div className="pl-2">
                            {'}'},
                          </div>
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>tracesSampleRate</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1.0</span>,
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>tracePropagationTargets</span>: [<span className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>'localhost:3001'</span>],
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>replaysSessionSampleRate</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1.0</span>,
                        </div>
                        <div className="ml-2">
                          <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>replaysOnErrorSampleRate</span>: <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1.0</span>,
                        </div>
                        <div>{'}'});</div>
                      </>
                    ) : (
                      /* Fallback to plain text for other courses */
                      <pre className="whitespace-pre-wrap">{contentConfig.codeExample.code}</pre>
                    )}
                  </div>
                </div>

                {/* Interactive Demo */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-blue-500/30 bg-blue-900/10'
                    : 'border-blue-300/30 bg-blue-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Interactive Sentry UI Demo
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className={`max-w-4xl border rounded-xl overflow-hidden ${
                      isDark 
                        ? 'border-slate-700/50 bg-slate-800/30' 
                        : 'border-gray-200 bg-gray-50/50'
                    }`}>
                      <Arcade 
                        src={contentConfig.arcadeUrl}
                      />
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      💡 <strong>Try it yourself:</strong> Explore the Sentry dashboard, view error details with stack traces, 
                      watch session replays, and see how performance monitoring identifies bottlenecks across your application.
                    </div>
                  </div>
                </div>

                {/* GitHub Repository Callout */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-green-500/30 bg-green-900/10'
                    : 'border-green-300/30 bg-green-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Github className="w-5 h-5 text-green-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Code Along with This Course
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Get hands-on experience with Sentry's complete monitoring stack. Fork this repository to access 
                      working Next.js examples with error tracking, performance monitoring, session replay, and user feedback.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://github.com/getsentry/sentry-academy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                          isDark
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30'
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>Fork Repository</span>
                      </a>
                      <a
                        href="https://github.com/getsentry/sentry-academy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isDark
                            ? 'border border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400/70'
                            : 'border border-green-500/50 text-green-600 hover:bg-green-50 hover:border-green-500/70'
                        }`}
                      >
                        View Repository
                      </a>
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      💡 <strong>Repository includes:</strong> Complete Next.js Sentry setup, error handling examples, 
                      custom tracing implementations, session replay configuration, and user feedback integration.
                    </div>
                  </div>
                </div>

                {/* Real World Application */}
                <a
                  href="https://sentry.io/customers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-all duration-200 hover:transform hover:scale-[1.025]"
                >
                  <div className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    isDark 
                      ? 'border-orange-500/30 bg-orange-900/10 hover:border-orange-400/50 hover:bg-orange-900/20'
                      : 'border-orange-300/30 bg-orange-50/30 hover:border-orange-400/50 hover:bg-orange-50/50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="w-5 h-5 text-orange-400" />
                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        People Like Us!
                      </h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                          isDark 
                            ? 'bg-slate-800/50 border border-slate-700/50' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <img 
                            src={isDark ? "/logos/rootly-logo-light.svg" : "/logos/rootly-logo.svg"}
                            alt="Rootly Logo" 
                            className="h-6 w-auto"
                          />
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          AI-native incident response platform
                        </span>
                      </div>
                      <h5 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        How Rootly Reduces MTTR by 50% with Sentry's Complete Stack
                      </h5>
                      <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-3`}>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                          }`}>Error Monitoring</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>Performance Monitoring</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                          }`}>Session Replay</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                          }`}>User Feedback</span>
                        </div>
                        <p>
                          Rootly achieved <strong>50% faster MTTR</strong> and avoided <strong>$100,000+ ARR impact</strong> 
                          by leveraging Sentry's complete monitoring ecosystem—from automatic error detection to session replay 
                          showing exactly what users experienced during incidents.
                        </p>
                        <p className="italic text-sm">
                          "Sentry's session replay is game-changing. We can see exactly what users experienced during an incident, 
                          making root cause analysis instantaneous instead of guesswork." — Dan Sadler, VP of Engineering
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-purple-500/20">
                <button 
                  disabled={activeModule === 0}
                  onClick={handlePrevious}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeModule === 0
                      ? isDark 
                        ? 'bg-slate-800/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100/30 text-gray-400 cursor-not-allowed'
                      : isDark
                        ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Previous
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={handleCompleteModule}
                    className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
                  >
                    Mark Complete
                  </button>
                  <button 
                    disabled={activeModule === modules.length - 1}
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeModule === modules.length - 1
                        ? isDark 
                          ? 'bg-slate-800/30 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100/30 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-400 text-white hover:from-purple-600 hover:to-pink-500 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30'
                    }`}
                  >
                    Next Module
                  </button>
                </div>
              </div>

              {/* Simple Next Recommendation */}
              {userProgress.role && nextRecommendation && nextRecommendation.moduleId !== courseId && (
                <div className="mt-8 pt-6 border-t border-purple-500/20">
                  <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
                    isDark 
                      ? 'bg-slate-900/40 border-emerald-500/40'
                      : 'bg-white/60 border-emerald-300/40'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      🎯 Recommended Next: {nextRecommendation.moduleId}
                    </h4>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {nextRecommendation.reasoning}
                    </p>
                    <button
                      onClick={() => navigate(`/course/${nextRecommendation.moduleId}`, { state: { from: 'learning-paths' } })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      Start Next Course
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseDetail.displayName = 'CourseDetail';

export default CourseDetail;