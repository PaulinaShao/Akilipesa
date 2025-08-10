import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import TanzaniteLogo from './TanzaniteLogo';

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'AI Calls', href: '/calls' },
      { name: 'Job Creation', href: '/jobs' },
      { name: 'Billing', href: '/billing' },
      { name: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <TanzaniteLogo size="lg" className="mb-4" />
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              AkiliPesa is Tanzania's premier AI financial assistant, 
              providing intelligent solutions for personal and business finance.
            </p>
            <div className="flex items-center text-sm text-slate-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              <span>in Tanzania</span>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} AkiliPesa. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-slate-400">
                Protected by reCAPTCHA Enterprise
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-slate-500">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
