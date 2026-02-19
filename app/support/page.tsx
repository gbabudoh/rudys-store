'use client';
import Link from 'next/link';
const HelpCircle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Mail = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Clock = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MessageSquare = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const FileText = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Truck = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0z" />
  </svg>
);

const CreditCard = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const RefreshCw = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" style={style} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Customer Support</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              We&apos;re here to help you every step of the way
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Quick Help Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Link
                href="/faq"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                  <HelpCircle className="w-6 h-6" style={{ color: '#cfa224' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#cfa224] transition-colors">FAQ</h3>
                <p className="text-gray-600 text-sm">Find answers to frequently asked questions</p>
              </Link>

              <Link
                href="/contact"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                  <Mail className="w-6 h-6" style={{ color: '#cfa224' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#cfa224] transition-colors">Contact Us</h3>
                <p className="text-gray-600 text-sm">Send us a message and we&apos;ll get back to you</p>
              </Link>

              <Link
                href="/shipping"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                  <Truck className="w-6 h-6" style={{ color: '#cfa224' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#cfa224] transition-colors">Shipping Info</h3>
                <p className="text-gray-600 text-sm">Learn about our shipping options and policies</p>
              </Link>

              <Link
                href="/returns"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                  <RefreshCw className="w-6 h-6" style={{ color: '#cfa224' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#cfa224] transition-colors">Returns & Exchanges</h3>
                <p className="text-gray-600 text-sm">How to return or exchange your items</p>
              </Link>

              <Link
                href="/size-guide"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                  <FileText className="w-6 h-6" style={{ color: '#cfa224' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#cfa224] transition-colors">Size Guide</h3>
                <p className="text-gray-600 text-sm">Find your perfect fit with our size guide</p>
              </Link>

              <button
                onClick={() => window.dispatchEvent(new Event('open-chatbot'))}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group text-left cursor-pointer w-full"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                  <MessageSquare className="w-6 h-6" style={{ color: '#cfa224' }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#cfa224] transition-colors">Live Chat</h3>
                <p className="text-gray-600 text-sm">Chat with Ruddy&apos;s Store Assistant in real-time</p>
              </button>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                      <Mail className="w-6 h-6" style={{ color: '#cfa224' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 text-sm mb-1">support@ruddysstore.com</p>
                    <p className="text-gray-600 text-sm">info@ruddysstore.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                      <Phone className="w-6 h-6" style={{ color: '#cfa224' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600 text-sm mb-1">Phone Only: (+234) 9137785395</p>
                    <p className="text-gray-600 text-sm">WhatsApp Only: (+234) 8134307973</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                      <Clock className="w-6 h-6" style={{ color: '#cfa224' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600 text-sm mb-1">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 text-sm">Sat: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 text-sm">Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Support Topics */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Support Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" style={{ color: '#cfa224' }} />
                    Payment & Billing
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Payment methods accepted</li>
                    <li>• Billing questions</li>
                    <li>• Refund processing</li>
                    <li>• Payment security</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2" style={{ color: '#cfa224' }} />
                    Shipping & Delivery
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Shipping options and costs</li>
                    <li>• Delivery times</li>
                    <li>• Track your order</li>
                    <li>• Shipping locations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <RefreshCw className="w-5 h-5 mr-2" style={{ color: '#cfa224' }} />
                    Returns & Exchanges
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Return policy</li>
                    <li>• How to return items</li>
                    <li>• Exchange process</li>
                    <li>• Refund timeline</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" style={{ color: '#cfa224' }} />
                    Product Information
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Size guide</li>
                    <li>• Product availability</li>
                    <li>• Care instructions</li>
                    <li>• Product specifications</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8" style={{ color: '#cfa224' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Response Times</h3>
                  <p className="text-gray-600 mb-4">
                    We aim to respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please call us directly during business hours.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Email inquiries: Within 24 hours</li>
                    <li>• Phone support: Immediate during business hours</li>
                    <li>• Live chat: Real-time assistance</li>
                    <li>• Social media: Within 12 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg shadow-lg p-8" style={{ backgroundColor: '#201d1e' }}>
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#cfa224' }}>Need More Help?</h2>
                <p className="text-gray-300 mb-6">
                  Our customer support team is ready to assist you with any questions or concerns
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all text-white"
                    style={{ backgroundColor: '#cfa224' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Support
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all border-2"
                    style={{ borderColor: '#cfa224', color: '#cfa224' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(207, 162, 36, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    View FAQ
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

