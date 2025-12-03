'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>About Rudy's Store</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Your premier destination for quality products and exceptional service
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Story Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Welcome to Rudy's Store, your premier destination for quality products and exceptional service. 
                  We believe in providing the finest selection of products that combine quality, style, and value.
                </p>
                <p className="text-gray-700 mb-4">
                  Founded with a passion for excellence and customer satisfaction, Rudy's Store has been 
                  dedicated to curating the best products across multiple categories, ensuring every customer 
                  finds exactly what they're looking for.
                </p>
                <p className="text-gray-700">
                  Our commitment extends beyond just selling products. We're here to provide an exceptional 
                  shopping experience, whether you're looking for premium fashion, luxury items, or comfortable 
                  everyday essentials.
                </p>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#cfa224' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  To provide high-quality products that empower our customers, combining style with functionality 
                  and ensuring exceptional value in every purchase.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#cfa224' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                <p className="text-gray-700">
                  Quality, integrity, and customer satisfaction are at the heart of everything we do. 
                  We're committed to providing exceptional service and products that exceed expectations.
                </p>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Slide & Sole?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                    <svg className="w-10 h-10" style={{ color: '#cfa224' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h4>
                  <p className="text-gray-600">Premium materials and craftsmanship in every item</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                    <svg className="w-10 h-10" style={{ color: '#cfa224' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h4>
                  <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                    <svg className="w-10 h-10" style={{ color: '#cfa224' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Customer Support</h4>
                  <p className="text-gray-600">Dedicated team ready to assist you</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="rounded-lg shadow-lg p-8 text-white text-center" style={{ backgroundColor: '#201d1e' }}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#cfa224' }}>Get in Touch</h2>
              <p className="text-xl mb-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Have questions? We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: '#cfa224', color: '#201d1e' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Contact Us
                </Link>
                <Link
                  href="/collections"
                  className="px-8 py-3 rounded-lg font-semibold transition-colors border-2"
                  style={{ backgroundColor: 'transparent', color: '#cfa224', borderColor: '#cfa224' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(207, 162, 36, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

