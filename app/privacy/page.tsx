'use client';

import Link from 'next/link';

const Shield = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UserCheck = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Privacy Policy</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Your privacy is important to us. Learn how we protect your data.
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
                <Shield className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Rudy's Store ("we," "our," or "us") is committed to protecting your privacy and personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you visit our website and use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and other applicable 
                data protection laws in Nigeria and Africa. By using our website, you consent to the data practices 
                described in this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-700 text-sm mb-2">We may collect the following personal information:</p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                    <li>Name, email address, phone number, and postal address</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                    <li>Account credentials and preferences</li>
                    <li>Order history and purchase information</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                  <p className="text-gray-700 text-sm mb-2">When you visit our website, we automatically collect:</p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 text-sm mb-4">We use your information for the following purposes:</p>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Processing Orders:</span>
                  <span>To process and fulfill your orders, manage payments, and deliver products</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Customer Service:</span>
                  <span>To respond to your inquiries, provide support, and handle returns or exchanges</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Marketing:</span>
                  <span>To send you promotional materials, newsletters, and updates (with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Website Improvement:</span>
                  <span>To analyze website usage, improve our services, and enhance user experience</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Legal Compliance:</span>
                  <span>To comply with legal obligations, enforce our terms, and protect our rights</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Fraud Prevention:</span>
                  <span>To detect and prevent fraudulent activities and ensure security</span>
                </li>
              </ul>
            </div>

            {/* Data Sharing and Disclosure */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Data Sharing and Disclosure</h2>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Service Providers:</span>
                  <span>Third-party companies that help us operate our business (payment processors, shipping companies, IT services)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Business Partners:</span>
                  <span>Trusted partners who assist in delivering our services (only with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Legal Requirements:</span>
                  <span>When required by law, court order, or government regulation</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">• Business Transfers:</span>
                  <span>In connection with a merger, acquisition, or sale of assets (with notice to users)</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm mt-4">
                All third-party service providers are contractually obligated to protect your data and use it only 
                for specified purposes in compliance with NDPR.
              </p>
            </div>

            {/* Data Security */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-8 h-8" style={{ color: '#cfa224' }} />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• SSL/TLS encryption for data transmission</li>
                <li>• Secure payment processing through certified providers</li>
                <li>• Regular security assessments and updates</li>
                <li>• Access controls and authentication mechanisms</li>
                <li>• Employee training on data protection</li>
                <li>• Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-gray-700 text-sm mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights Under NDPR */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights Under NDPR</h2>
              <p className="text-gray-700 text-sm mb-4">
                As a data subject under the Nigeria Data Protection Regulation, you have the following rights:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Access</h3>
                  <p className="text-gray-600 text-sm">Request access to your personal data we hold</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Rectification</h3>
                  <p className="text-gray-600 text-sm">Request correction of inaccurate or incomplete data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Erasure</h3>
                  <p className="text-gray-600 text-sm">Request deletion of your personal data (subject to legal obligations)</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Restrict Processing</h3>
                  <p className="text-gray-600 text-sm">Request limitation of how we process your data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Data Portability</h3>
                  <p className="text-gray-600 text-sm">Receive your data in a structured, commonly used format</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Object</h3>
                  <p className="text-gray-600 text-sm">Object to processing of your data for marketing or legitimate interests</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Withdraw Consent</h3>
                  <p className="text-gray-600 text-sm">Withdraw consent for data processing at any time</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below. 
                We will respond to your request within 30 days as required by NDPR.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 text-sm mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm">Required for website functionality and cannot be disabled</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm">Help us understand how visitors interact with our website (Google Analytics)</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h3>
                  <p className="text-gray-600 text-sm">Used to deliver relevant advertisements and track campaign effectiveness</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                You can control cookies through your browser settings. However, disabling cookies may affect 
                website functionality.
              </p>
            </div>

            {/* Data Retention */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 text-sm mb-4">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Account information: Retained while your account is active and for 7 years after closure for legal compliance</li>
                <li>• Order information: Retained for 7 years for tax and legal purposes</li>
                <li>• Marketing data: Retained until you unsubscribe or withdraw consent</li>
                <li>• Website analytics: Retained in aggregated form for up to 26 months</li>
              </ul>
              <p className="text-gray-700 text-sm mt-4">
                After the retention period, we securely delete or anonymize your data in accordance with NDPR requirements.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 text-sm">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately, and we will take steps to delete such information.
              </p>
            </div>

            {/* International Data Transfers */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-700 text-sm">
                Your data may be transferred to and processed in countries outside Nigeria. We ensure that 
                appropriate safeguards are in place to protect your data in accordance with NDPR requirements. 
                By using our services, you consent to such transfers.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 text-sm">
                We may update this Privacy Policy from time to time to reflect changes in our practices or 
                legal requirements. We will notify you of any material changes by posting the new policy on 
                this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{ backgroundColor: '#201d1e' }}>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#cfa224' }}>Contact Us</h2>
                <p className="text-gray-300 mb-4">
                  If you have questions about this Privacy Policy or wish to exercise your rights under NDPR, 
                  please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong style={{ color: '#cfa224' }}>Data Protection Officer:</strong></p>
                  <p>Email: privacy@rudystore.com</p>
                  <p>Phone: +234 (0) 800 123 4567</p>
                  <p className="mt-4"><strong style={{ color: '#cfa224' }}>General Inquiries:</strong></p>
                  <p>Email: support@rudystore.com</p>
                  <p>Address: 123 Fashion Street, Style City, Nigeria</p>
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
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">Compliance Notice:</strong> This Privacy Policy complies with 
                the Nigeria Data Protection Regulation (NDPR) 2019, the Nigeria Data Protection Act 2023, and 
                other applicable data protection laws in Nigeria and Africa. We are committed to protecting 
                your privacy and ensuring transparency in our data practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

