'use client';

import Link from 'next/link';

const Truck = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Package = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Shipping Information</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Fast, reliable delivery to your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Shipping Methods */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Methods</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                        <Truck className="w-6 h-6" style={{ color: '#cfa224' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Standard Shipping</h3>
                        <p className="text-gray-600 mb-3">
                          Our standard shipping option delivers your order within 5-7 business days. 
                          Perfect for non-urgent purchases.
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>5-7 business days</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>₦5,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                        <Truck className="w-6 h-6" style={{ color: '#cfa224' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Express Shipping</h3>
                        <p className="text-gray-600 mb-3">
                          Need it faster? Express shipping delivers within 2-3 business days. 
                          Track your package every step of the way.
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>2-3 business days</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>₦15,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#cfa224', backgroundColor: 'rgba(207, 162, 36, 0.05)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#cfa224' }}>
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">Free Shipping</h3>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: '#cfa224' }}>
                            Popular
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Free standard shipping on orders over ₦50,000. 
                          No hidden fees, just fast and free delivery to your door.
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>5-7 business days</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span className="font-semibold" style={{ color: '#cfa224' }}>FREE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-8 h-8" style={{ color: '#cfa224' }} />
                  <h3 className="text-xl font-semibold text-gray-900">Shipping Locations</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  We currently ship to all states within Nigeria. International shipping 
                  is available for select countries.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#cfa224' }} />
                    <span>All Nigerian States</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#cfa224' }} />
                    <span>Lagos - Same Day Delivery Available</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#cfa224' }} />
                    <span>Abuja - Express Delivery</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-8 h-8" style={{ color: '#cfa224' }} />
                  <h3 className="text-xl font-semibold text-gray-900">Processing Time</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Orders are typically processed and shipped within 1-2 business days 
                  after payment confirmation.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#cfa224' }} />
                    <span>Order Processing: 1-2 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#cfa224' }} />
                    <span>Weekend orders processed on Monday</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#cfa224' }} />
                    <span>Holiday delays may apply</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tracking & Support */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Once your order ships, you'll receive a tracking number via email. 
                    Use it to track your package in real-time.
                  </p>
                  <Link
                    href="/tracking"
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors text-white"
                    style={{ backgroundColor: '#cfa224' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Track Order
                  </Link>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Have questions about shipping? Our customer support team is here to help.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors border-2"
                    style={{ borderColor: '#cfa224', color: '#cfa224' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(207, 162, 36, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping FAQ</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
                  <p className="text-gray-600 text-sm">
                    Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. 
                    Processing time is additional 1-2 business days.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, we ship to select international destinations. International shipping rates and 
                    delivery times vary by location. Please contact us for more information.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What if my package is damaged?</h3>
                  <p className="text-gray-600 text-sm">
                    If your package arrives damaged, please contact us within 48 hours with photos. 
                    We'll arrange a replacement or refund immediately.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I change my shipping address?</h3>
                  <p className="text-gray-600 text-sm">
                    You can change your shipping address before your order ships. Once shipped, 
                    address changes may incur additional fees. Contact us as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

