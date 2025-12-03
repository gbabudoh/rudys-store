'use client';

import Link from 'next/link';

const Scale = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Terms of Service</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Terms and conditions governing your use of Rudy's Store
            </p>
            <p className="mt-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Last Updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Rudy's Store. These Terms of Service ("Terms") govern your access to and use of our 
                website, products, and services. By accessing or using our website, you agree to be bound by 
                these Terms and all applicable laws and regulations in Nigeria.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms comply with the Consumer Protection Council Act of Nigeria, the Sale of Goods Act, 
                and other applicable consumer protection laws in Nigeria and Africa. If you do not agree with 
                any part of these Terms, you must not use our services.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 text-sm mb-4">
                By accessing our website, creating an account, or making a purchase, you acknowledge that you 
                have read, understood, and agree to be bound by these Terms. These Terms constitute a legally 
                binding agreement between you and Rudy's Store.
              </p>
              <p className="text-gray-700 text-sm">
                We reserve the right to modify these Terms at any time. Material changes will be notified on 
                this page with an updated "Last Updated" date. Your continued use of our services after such 
                modifications constitutes acceptance of the updated Terms.
              </p>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility</h2>
              <p className="text-gray-700 text-sm mb-4">To use our services, you must:</p>
              <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside ml-4">
                <li>Be at least 18 years of age or have parental/guardian consent</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and complete information when creating an account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            {/* Products and Services */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Products and Services</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product Descriptions</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    We strive to provide accurate descriptions and images of our products. However, we do not 
                    warrant that product descriptions, images, or other content are completely accurate, 
                    complete, reliable, current, or error-free.
                  </p>
                  <p className="text-gray-700 text-sm">
                    Product colors may vary due to display settings. If a product is not as described, you may 
                    return it in accordance with our Returns Policy.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product Availability</h3>
                  <p className="text-gray-700 text-sm">
                    All products are subject to availability. We reserve the right to limit quantities, 
                    discontinue products, or refuse orders at our discretion. If a product becomes unavailable 
                    after you place an order, we will notify you and provide a full refund.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    All prices are displayed in Nigerian Naira (₦) and are inclusive of applicable taxes where 
                    required by law. We reserve the right to change prices at any time, but changes will not 
                    affect orders already confirmed.
                  </p>
                  <p className="text-gray-700 text-sm">
                    In the event of a pricing error, we reserve the right to cancel the order and provide a 
                    full refund, in compliance with consumer protection laws.
                  </p>
                </div>
              </div>
            </div>

            {/* Orders and Payment */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Process</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    When you place an order, you are making an offer to purchase products at the prices stated. 
                    We will send you an order confirmation email. A contract is formed when we accept your order 
                    and send you a confirmation email.
                  </p>
                  <p className="text-gray-700 text-sm">
                    We reserve the right to refuse or cancel any order for any reason, including but not limited 
                    to product availability, pricing errors, or suspected fraudulent activity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Terms</h3>
                  <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside ml-4">
                    <li>Payment must be made at the time of order placement</li>
                    <li>We accept major credit/debit cards, bank transfers, and Paystack payments</li>
                    <li>All payments are processed securely through certified payment processors</li>
                    <li>Your payment will be charged immediately upon order confirmation</li>
                    <li>In case of order cancellation, refunds will be processed within 5-7 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Cancellation</h3>
                  <p className="text-gray-700 text-sm">
                    You may cancel your order within 2 hours of placement, provided it has not been processed 
                    for shipping. After this period, cancellation may not be possible, and you may need to 
                    return the product in accordance with our Returns Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Consumer Rights */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Your Consumer Rights</h2>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Under Nigerian consumer protection laws, you have the following rights:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-2" style={{ color: '#cfa224' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Right to Quality Products</h3>
                    <p className="text-gray-600 text-sm">Products must be of satisfactory quality, fit for purpose, and as described</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-2" style={{ color: '#cfa224' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Right to Return</h3>
                    <p className="text-gray-600 text-sm">Return products within 30 days if they are faulty, not as described, or unsuitable</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-2" style={{ color: '#cfa224' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Right to Refund</h3>
                    <p className="text-gray-600 text-sm">Receive a full refund for faulty products or products not as described</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-2" style={{ color: '#cfa224' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Right to Repair or Replacement</h3>
                    <p className="text-gray-600 text-sm">Request repair or replacement of faulty products at no additional cost</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-2" style={{ color: '#cfa224' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Right to Information</h3>
                    <p className="text-gray-600 text-sm">Receive clear and accurate information about products, prices, and terms</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-2" style={{ color: '#cfa224' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Right to Fair Treatment</h3>
                    <p className="text-gray-600 text-sm">Be treated fairly and not be subject to unfair trading practices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns and Refunds */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Return Policy</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    You may return products within 30 days of delivery, provided they are:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside ml-4">
                    <li>Unworn, unwashed, and in original condition</li>
                    <li>In original packaging with tags attached</li>
                    <li>Accompanied by proof of purchase</li>
                  </ul>
                  <p className="text-gray-700 text-sm mt-2">
                    For detailed return procedures, please visit our <Link href="/returns" className="text-[#cfa224] hover:underline">Returns & Exchanges</Link> page.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Policy</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Refunds will be processed within 5-7 business days after we receive and inspect the returned 
                    product. Refunds will be issued to the original payment method used for the purchase.
                  </p>
                  <p className="text-gray-700 text-sm">
                    Original shipping costs are non-refundable unless the return is due to our error or a 
                    defective product, in compliance with consumer protection standards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Faulty or Defective Products</h3>
                  <p className="text-gray-700 text-sm">
                    If you receive a faulty or defective product, you are entitled to a full refund, repair, or 
                    replacement at no cost, in accordance with the Sale of Goods Act. Please contact us 
                    immediately upon discovery of any defect.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Terms</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    We ship to all 36 states in Nigeria, including the Federal Capital Territory, Abuja. 
                    Delivery times vary based on your location and selected shipping method:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside ml-4">
                    <li>Standard shipping: 5-7 business days</li>
                    <li>Express shipping: 2-3 business days</li>
                    <li>Processing time: 1-2 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Risk and Title</h3>
                  <p className="text-gray-700 text-sm">
                    Risk of loss and title to products pass to you upon delivery to the carrier. We are not 
                    responsible for any loss or damage that occurs during transit, but we will assist you in 
                    filing claims with the shipping carrier.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Issues</h3>
                  <p className="text-gray-700 text-sm">
                    If you experience delivery issues, please contact us immediately. We will work with the 
                    shipping carrier to resolve the issue and ensure you receive your order or receive a full refund.
                  </p>
                </div>
              </div>
            </div>

            {/* Warranties */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Warranties</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product Warranties</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    All products are covered by statutory warranties under Nigerian law, including:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside ml-4">
                    <li>Products must be of satisfactory quality</li>
                    <li>Products must be fit for their intended purpose</li>
                    <li>Products must match their description</li>
                    <li>Products must match any sample shown to you</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Manufacturer Warranties</h3>
                  <p className="text-gray-700 text-sm">
                    Some products may come with additional manufacturer warranties. Details of such warranties 
                    will be provided with the product or can be obtained from the manufacturer. Our statutory 
                    obligations are in addition to any manufacturer warranties.
                  </p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Our Liability</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    To the fullest extent permitted by Nigerian law, our liability is limited to:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside ml-4">
                    <li>The purchase price of the product</li>
                    <li>Replacement or repair of defective products</li>
                    <li>Direct damages arising from our breach of contract</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exclusions</h3>
                  <p className="text-gray-700 text-sm">
                    We are not liable for indirect, incidental, special, or consequential damages, including but 
                    not limited to loss of profits, data, or business opportunities, except where such exclusion 
                    is prohibited by Nigerian consumer protection law.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Force Majeure</h3>
                  <p className="text-gray-700 text-sm">
                    We are not liable for any failure or delay in performance due to circumstances beyond our 
                    reasonable control, including natural disasters, war, terrorism, labor disputes, or government actions.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 text-sm mb-4">
                All content on our website, including text, graphics, logos, images, and software, is the 
                property of Rudy's Store or its content suppliers and is protected by Nigerian and international 
                copyright and trademark laws.
              </p>
              <p className="text-gray-700 text-sm">
                You may not reproduce, distribute, modify, or create derivative works from any content without 
                our express written permission. Unauthorized use may violate copyright, trademark, and other laws.
              </p>
            </div>

            {/* User Conduct */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Conduct</h2>
              <p className="text-gray-700 text-sm mb-4">You agree not to:</p>
              <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside ml-4">
                <li>Use our website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our website or servers</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Use automated systems to access our website without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest information about other users</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
              <p className="text-gray-700 text-sm mt-4">
                Violation of these terms may result in termination of your account and legal action.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informal Resolution</h3>
                  <p className="text-gray-700 text-sm">
                    We encourage you to contact us first to resolve any disputes informally. Our customer 
                    service team is committed to resolving issues fairly and promptly.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Consumer Protection Council</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    If you are unable to resolve a dispute with us, you may file a complaint with the Consumer 
                    Protection Council (CPC) of Nigeria or your local consumer protection agency.
                  </p>
                  <p className="text-gray-700 text-sm">
                    Contact information for CPC: Website: www.cpc.gov.ng | Phone: 0800-000-0000
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Governing Law</h3>
                  <p className="text-gray-700 text-sm">
                    These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes 
                    arising from these Terms or your use of our services shall be subject to the exclusive 
                    jurisdiction of Nigerian courts.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
              <p className="text-gray-700 text-sm mb-4">
                Your use of our website is also governed by our Privacy Policy, which complies with the Nigeria 
                Data Protection Regulation (NDPR) 2019. Please review our <Link href="/privacy" className="text-[#cfa224] hover:underline">Privacy Policy</Link> to 
                understand how we collect, use, and protect your personal information.
              </p>
            </div>

            {/* Modifications to Terms */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
              <p className="text-gray-700 text-sm">
                We reserve the right to modify these Terms at any time. Material changes will be posted on this 
                page with an updated "Last Updated" date. Your continued use of our services after such 
                modifications constitutes acceptance of the updated Terms. If you do not agree with the 
                modifications, you must stop using our services.
              </p>
            </div>

            {/* Severability */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-700 text-sm">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court 
                of competent jurisdiction, the remaining provisions shall remain in full force and effect. 
                The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ backgroundColor: '#201d1e' }}>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#cfa224' }}>Contact Us</h2>
                <p className="text-gray-300 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong style={{ color: '#cfa224' }}>Email:</strong> legal@rudystore.com</p>
                  <p><strong style={{ color: '#cfa224' }}>Phone:</strong> +234 (0) 800 123 4567</p>
                  <p><strong style={{ color: '#cfa224' }}>Address:</strong> 123 Fashion Street, Style City, Nigeria</p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all text-white"
                    style={{ backgroundColor: '#cfa224' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

            {/* Compliance Notice */}
            <div className="bg-white rounded-lg shadow-lg p-6" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#cfa224' }} />
                <div>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Compliance Notice:</strong> These Terms of Service comply 
                    with the Consumer Protection Council Act of Nigeria, the Sale of Goods Act, and other 
                    applicable consumer protection laws in Nigeria and Africa. We are committed to protecting 
                    consumer rights and ensuring fair trading practices.
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

