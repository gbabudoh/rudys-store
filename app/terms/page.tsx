'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageContent {
  title: string;
  content: string;
}

export default function TermsPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content-pages/terms-of-service')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.page) {
          setContent(data.page);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Convert markdown-like content to HTML
  const renderContent = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, index) => {
        // Handle headers
        if (paragraph.startsWith('#### ')) {
          return <h4 key={index} className="text-lg font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('#### ', '')}</h4>;
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
        }
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          return <p key={index} className="font-semibold text-gray-700 mb-2">{paragraph.replace(/\*\*/g, '')}</p>;
        }
        // Regular paragraph
        return <p key={index} className="text-gray-600 mb-4 leading-relaxed">{paragraph}</p>;
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#cfa224' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>
              {content?.title || 'Terms of Service'}
            </h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              {content?.content ? (
                <div className="prose prose-lg max-w-none">
                  {renderContent(content.content)}
                </div>
              ) : (
                <p className="text-gray-600">Content not available. Please check back later.</p>
              )}
            </div>

            {/* Back Link */}
            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
