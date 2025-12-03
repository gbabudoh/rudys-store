'use client';

import Link from 'next/link';

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Returns & Exchanges</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Easy returns and exchanges within 30 days
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Return Policy Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Return Policy</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  At Rudy's Store, we want you to be completely satisfied with your purchase. 
                  If you're not happy with your order, we offer hassle-free returns and exchanges 
                  within 30 days of delivery.
                </p>
                <p className="text-gray-700">
                  All items must be unworn, unwashed, and in their original packaging with tags attached. 
                  We'll process your refund or exchange as soon as we receive your returned items.
                </p>
              </div>
            </div>

            {/* Return Process Steps */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: '#cfa224' }}>
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Request a Return</h3>
                    <p className="text-gray-600">
                      Log into your account or contact our customer service team to initiate a return. 
                      You'll need your order number and the items you'd like to return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: '#cfa224' }}>
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Your Items</h3>
                    <p className="text-gray-600">
                      Place the items in their original packaging with tags attached. Include the 
                      return authorization form we'll provide. Use the original shipping box if possible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: '#cfa224' }}>
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship It Back</h3>
                    <p className="text-gray-600">
                      Ship your return using the prepaid return label we provide, or use your preferred 
                      shipping method. Keep your tracking number for reference.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: '#cfa224' }}>
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Receive Your Refund</h3>
                    <p className="text-gray-600">
                      Once we receive and inspect your return, we'll process your refund within 5-7 
                      business days. You'll receive an email confirmation when it's complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-8 h-8" style={{ color: '#cfa224' }} />
                  <h3 className="text-xl font-semibold text-gray-900">Eligible for Return</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#cfa224' }} />
                    <span>Items returned within 30 days of delivery</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#cfa224' }} />
                    <span>Unworn, unwashed items with tags attached</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#cfa224' }} />
                    <span>Original packaging included</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#cfa224' }} />
                    <span>Proof of purchase provided</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Not Eligible for Return</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                    <span>Items returned after 30 days</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                    <span>Worn, damaged, or used items</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                    <span>Items without original tags or packaging</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                    <span>Personalized or custom-made items</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Exchange Policy */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <RefreshCw className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Exchange Policy</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Need a different size or color? We offer free exchanges within 30 days of delivery. 
                  Simply follow the return process and specify that you'd like an exchange instead of a refund.
                </p>
                <p className="text-gray-700">
                  Exchanges are subject to item availability. If your desired size or color is out of stock, 
                  we'll process a refund instead. You can also exchange for a different item of equal or 
                  greater value (you'll pay the difference).
                </p>
              </div>
            </div>

            {/* Refund Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Package className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Refund Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Refunds will be issued to the original payment method used for the purchase. 
                    Processing time is 5-7 business days after we receive your return.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Costs</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Original shipping costs are non-refundable unless the return is due to our error 
                    or a defective item. Return shipping is free for eligible returns.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#cfa224' }} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Sale items are eligible for exchange or store credit only</li>
                    <li>• Final sale items cannot be returned or exchanged</li>
                    <li>• We recommend using a trackable shipping method for returns</li>
                    <li>• Rudy's Store is not responsible for return shipments until we receive them</li>
                    <li>• Refunds may take 1-2 billing cycles to appear on your statement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg shadow-lg p-8" style={{ backgroundColor: '#201d1e' }}>
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#cfa224' }}>Ready to Return or Exchange?</h2>
                <p className="text-gray-300 mb-6">
                  Start your return process or contact our support team for assistance
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all text-white"
                    style={{ backgroundColor: '#cfa224' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Start Return
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all border-2"
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
          </div>
        </div>
      </section>
    </div>
  );
}

