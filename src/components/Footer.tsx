import React, { memo, useMemo } from 'react';
import { BookOpen, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getTextClasses } from '../utils/styles';

const Footer: React.FC = memo(() => {
  const { isDark } = useTheme();

  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark]);
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark]);
  const linkClasses = useMemo(() => 
    `transition-colors duration-200 ${
      isDark 
        ? 'text-gray-300 hover:text-purple-400' 
        : 'text-gray-600 hover:text-purple-600'
    }`, [isDark]
  );

  const footerLinks = {
    product: [
      { name: 'Learning Paths', href: '#paths' },
      { name: 'All Courses', href: '#courses' },
      { name: 'Assessments', href: '#' },
      { name: 'Certificates', href: '#' }
    ],
    resources: [
      { name: 'Sentry Docs', href: 'https://docs.sentry.io', external: true },
      { name: 'Sentry Platform', href: 'https://sentry.io', external: true },
      { name: 'Community Forum', href: '#' },
      { name: 'Support', href: '#' }
    ],
    company: [
      { name: 'About Academy', href: '#' },
      { name: 'Instructors', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Careers', href: '#' }
    ]
  };

  return (
    <footer className={`backdrop-blur-xl border-t ${
      isDark 
        ? 'bg-slate-950/80 border-purple-500/30' 
        : 'bg-white/80 border-purple-300/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${titleClasses}`}>
                  Sentry Academy
                </h3>
                <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  Master Application Observability
                </p>
              </div>
            </div>
            <p className={`leading-relaxed mb-6 ${subtitleClasses}`}>
              The comprehensive learning platform for mastering Sentry.io
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group border hover:border-purple-400/40 ${
                isDark 
                  ? 'bg-slate-900/60 border-purple-500/20' 
                  : 'bg-gray-100/60 border-purple-300/20'
              }`}>
                <Github className={`w-5 h-5 group-hover:text-purple-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </a>
              <a href="#" className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group border hover:border-purple-400/40 ${
                isDark 
                  ? 'bg-slate-900/60 border-purple-500/20' 
                  : 'bg-gray-100/60 border-purple-300/20'
              }`}>
                <Twitter className={`w-5 h-5 group-hover:text-purple-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </a>
              <a href="#" className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group border hover:border-purple-400/40 ${
                isDark 
                  ? 'bg-slate-900/60 border-purple-500/20' 
                  : 'bg-gray-100/60 border-purple-300/20'
              }`}>
                <Linkedin className={`w-5 h-5 group-hover:text-purple-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className={`font-semibold mb-6 ${titleClasses}`}>
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={linkClasses}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-6 ${titleClasses}`}>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className={`${linkClasses} flex items-center space-x-1`}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-6 ${titleClasses}`}>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={linkClasses}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${
          isDark ? 'border-purple-500/20' : 'border-purple-300/20'
        }`}>
          <div className={`text-sm mb-4 md:mb-0 ${subtitleClasses}`}>
            © 2025 Sentry Academy. All rights reserved.
          </div>
          <div className={`flex space-x-6 text-sm ${subtitleClasses}`}>
            <a href="#" className={linkClasses}>Privacy Policy</a>
            <a href="#" className={linkClasses}>Terms of Service</a>
            <a href="#" className={linkClasses}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;