'use client';

import { useState, useEffect } from 'react';
import DynamicContent from '../components/DynamicContent';

export default function ReturnsPage() {
  const [content, setContent] = useState<{ title: string, content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content-pages/returns-exchanges')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.page) {
          setContent(data.page);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
              {content?.title || 'Returns & Exchanges'}
            </h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {content?.content?.split('\n\n')[0]?.replace(/###\s/, '') || "Easy returns and exchanges within 30 days"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Admin Dynamic Content */}
            {content?.content && content.content.split('\n\n').length > 1 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-l-8" style={{ borderColor: '#cfa224' }}>
                <DynamicContent content={content.content.split('\n\n').slice(1).join('\n\n')} />
              </div>
            ) : content?.content ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-l-8" style={{ borderColor: '#cfa224' }}>
                <DynamicContent content={content.content} />
              </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                  <p className="text-gray-600">No return policy content available yet.</p>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
