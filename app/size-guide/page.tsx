'use client';

import { useState } from 'react';
import Link from 'next/link';

const Ruler = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const User = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState<'clothing' | 'shoes' | 'accessories'>('clothing');

  const clothingSizes = {
    women: [
      { size: 'XS', chest: '32-34"', waist: '24-26"', hips: '34-36"', uk: '6', us: '0-2' },
      { size: 'S', chest: '34-36"', waist: '26-28"', hips: '36-38"', uk: '8', us: '4-6' },
      { size: 'M', chest: '36-38"', waist: '28-30"', hips: '38-40"', uk: '10', us: '8-10' },
      { size: 'L', chest: '38-40"', waist: '30-32"', hips: '40-42"', uk: '12', us: '12-14' },
      { size: 'XL', chest: '40-42"', waist: '32-34"', hips: '42-44"', uk: '14', us: '16-18' },
      { size: 'XXL', chest: '42-44"', waist: '34-36"', hips: '44-46"', uk: '16', us: '20-22' },
    ],
    men: [
      { size: 'XS', chest: '34-36"', waist: '28-30"', uk: '32', us: '32' },
      { size: 'S', chest: '36-38"', waist: '30-32"', uk: '34', us: '34' },
      { size: 'M', chest: '38-40"', waist: '32-34"', uk: '36', us: '36' },
      { size: 'L', chest: '40-42"', waist: '34-36"', uk: '38', us: '38' },
      { size: 'XL', chest: '42-44"', waist: '36-38"', uk: '40', us: '40' },
      { size: 'XXL', chest: '44-46"', waist: '38-40"', uk: '42', us: '42' },
    ],
  };

  const shoeSizes = {
    women: [
      { uk: '3', us: '5', eu: '35', cm: '22' },
      { uk: '4', us: '6', eu: '36', cm: '23' },
      { uk: '5', us: '7', eu: '37', cm: '24' },
      { uk: '6', us: '8', eu: '38', cm: '25' },
      { uk: '7', us: '9', eu: '39', cm: '26' },
      { uk: '8', us: '10', eu: '40', cm: '27' },
      { uk: '9', us: '11', eu: '41', cm: '28' },
    ],
    men: [
      { uk: '7', us: '8', eu: '41', cm: '26' },
      { uk: '8', us: '9', eu: '42', cm: '27' },
      { uk: '9', us: '10', eu: '43', cm: '28' },
      { uk: '10', us: '11', eu: '44', cm: '29' },
      { uk: '11', us: '12', eu: '45', cm: '30' },
      { uk: '12', us: '13', eu: '46', cm: '31' },
      { uk: '13', us: '14', eu: '47', cm: '32' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Size Guide</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Find your perfect fit with our comprehensive sizing guide
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs */}
            <div className="bg-white rounded-lg shadow-lg p-2 mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('clothing')}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeCategory === 'clothing'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={activeCategory === 'clothing' ? { backgroundColor: '#cfa224' } : {}}
                >
                  Clothing
                </button>
                <button
                  onClick={() => setActiveCategory('shoes')}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeCategory === 'shoes'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={activeCategory === 'shoes' ? { backgroundColor: '#cfa224' } : {}}
                >
                  Shoes
                </button>
                <button
                  onClick={() => setActiveCategory('accessories')}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeCategory === 'accessories'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={activeCategory === 'accessories' ? { backgroundColor: '#cfa224' } : {}}
                >
                  Accessories
                </button>
              </div>
            </div>

            {/* Clothing Size Guide */}
            {activeCategory === 'clothing' && (
              <div className="space-y-8">
                {/* Women's Sizes */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-8 h-8" style={{ color: '#cfa224' }} />
                    <h2 className="text-2xl font-bold text-gray-900">Women&apos;s Clothing Sizes</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2" style={{ borderColor: '#cfa224' }}>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Chest</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Waist</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Hips</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">UK</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">US</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clothingSizes.women.map((size, index) => (
                          <tr key={size.size} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-gray-900">{size.size}</td>
                            <td className="py-3 px-4 text-gray-600">{size.chest}</td>
                            <td className="py-3 px-4 text-gray-600">{size.waist}</td>
                            <td className="py-3 px-4 text-gray-600">{size.hips}</td>
                            <td className="py-3 px-4 text-gray-600">{size.uk}</td>
                            <td className="py-3 px-4 text-gray-600">{size.us}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Men's Sizes */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-8 h-8" style={{ color: '#cfa224' }} />
                    <h2 className="text-2xl font-bold text-gray-900">Men&apos;s Clothing Sizes</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2" style={{ borderColor: '#cfa224' }}>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Chest</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Waist</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">UK</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">US</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clothingSizes.men.map((size, index) => (
                          <tr key={size.size} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-gray-900">{size.size}</td>
                            <td className="py-3 px-4 text-gray-600">{size.chest}</td>
                            <td className="py-3 px-4 text-gray-600">{size.waist}</td>
                            <td className="py-3 px-4 text-gray-600">{size.uk}</td>
                            <td className="py-3 px-4 text-gray-600">{size.us}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Shoe Size Guide */}
            {activeCategory === 'shoes' && (
              <div className="space-y-8">
                {/* Women's Shoe Sizes */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Ruler className="w-8 h-8" style={{ color: '#cfa224' }} />
                    <h2 className="text-2xl font-bold text-gray-900">Women&apos;s Shoe Sizes</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2" style={{ borderColor: '#cfa224' }}>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">UK</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">US</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">EU</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">CM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shoeSizes.women.map((size, index) => (
                          <tr key={size.uk} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-gray-900">{size.uk}</td>
                            <td className="py-3 px-4 text-gray-600">{size.us}</td>
                            <td className="py-3 px-4 text-gray-600">{size.eu}</td>
                            <td className="py-3 px-4 text-gray-600">{size.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Men's Shoe Sizes */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Ruler className="w-8 h-8" style={{ color: '#cfa224' }} />
                    <h2 className="text-2xl font-bold text-gray-900">Men&apos;s Shoe Sizes</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2" style={{ borderColor: '#cfa224' }}>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">UK</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">US</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">EU</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">CM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shoeSizes.men.map((size, index) => (
                          <tr key={size.uk} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-gray-900">{size.uk}</td>
                            <td className="py-3 px-4 text-gray-600">{size.us}</td>
                            <td className="py-3 px-4 text-gray-600">{size.eu}</td>
                            <td className="py-3 px-4 text-gray-600">{size.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Accessories Size Guide */}
            {activeCategory === 'accessories' && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Ruler className="w-8 h-8" style={{ color: '#cfa224' }} />
                  <h2 className="text-2xl font-bold text-gray-900">Accessories Sizing</h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 mb-6">
                    Our accessories come in various sizes to fit your style. Here&apos;s a guide to help you choose the right size:
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Bags & Handbags</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li><strong>Small:</strong> 10&quot; x 8&quot; x 4&quot; - Perfect for essentials</li>
                        <li><strong>Medium:</strong> 13&quot; x 10&quot; x 5&quot; - Ideal for everyday use</li>
                        <li><strong>Large:</strong> 16&quot; x 12&quot; x 6&quot; - Great for work or travel</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Belts</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li><strong>XS:</strong> 28-30 inches</li>
                        <li><strong>S:</strong> 30-32 inches</li>
                        <li><strong>M:</strong> 32-34 inches</li>
                        <li><strong>L:</strong> 34-36 inches</li>
                        <li><strong>XL:</strong> 36-38 inches</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Jewelry</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li><strong>Rings:</strong> Available in sizes 4-12 (US sizing)</li>
                        <li><strong>Bracelets:</strong> Small (6-6.5&quot;), Medium (7-7.5&quot;), Large (8-8.5&quot;)</li>
                        <li><strong>Necklaces:</strong> 16&quot;, 18&quot;, 20&quot;, 24&quot; chain lengths</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Measurement Guide */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Measure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">For Clothing</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                    <li><strong>Waist:</strong> Measure around your natural waistline</li>
                    <li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
                    <li><strong>Inseam:</strong> Measure from crotch to ankle (for pants)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">For Shoes</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>Measure your foot length from heel to toe</li>
                    <li>Measure your foot width at the widest point</li>
                    <li>Measure in the evening when feet are largest</li>
                    <li>Use a ruler or measuring tape on a flat surface</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                    <User className="w-6 h-6" style={{ color: '#cfa224' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Still Unsure About Your Size?</h3>
                  <p className="text-gray-600 mb-4">
                    Our customer service team is here to help you find the perfect fit. 
                    Contact us with your measurements and we&apos;ll recommend the best size for you.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors text-white"
                    style={{ backgroundColor: '#cfa224' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Contact Us for Help
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

