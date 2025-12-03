'use client';

import { useState } from 'react';
import Link from 'next/link';

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const HelpCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'orders' | 'shipping' | 'returns' | 'payments' | 'products';
}

const faqData: FAQItem[] = [
  {
    category: 'general',
    question: 'What is Rudy\'s Store?',
    answer: 'Rudy\'s Store is your premier destination for premium fashion, luxury items, and exclusive footwear. We offer a curated selection that combines elegance, comfort, and the latest trends, including Ruddy Collections, Ruddy Luxury, and Slide & Sole footwear.',
  },
  {
    category: 'general',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Sign In" button in the header, then selecting "Create Account". You\'ll need to provide your email address and create a password. Having an account allows you to track orders, save favorites, and enjoy faster checkout.',
  },
  {
    category: 'general',
    question: 'Do you have a physical store?',
    answer: 'Currently, Rudy\'s Store operates as an online-only retailer. This allows us to offer competitive prices and a wider selection. However, we\'re always exploring opportunities to expand. Check our website for updates on any future physical locations.',
  },
  {
    category: 'orders',
    question: 'How do I place an order?',
    answer: 'Browse our collections, add items to your cart, and proceed to checkout. You\'ll need to provide shipping information and payment details. Once your order is confirmed, you\'ll receive an email confirmation with your order number and tracking information.',
  },
  {
    category: 'orders',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 2 hours of placement, provided they haven\'t been processed for shipping. After this window, please contact our customer service team immediately. We\'ll do our best to accommodate your request, but cannot guarantee changes once processing has begun.',
  },
  {
    category: 'orders',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number on our tracking page or with the shipping carrier\'s website to monitor your package\'s progress. You can also log into your account to view order status.',
  },
  {
    category: 'shipping',
    question: 'Where do you ship?',
    answer: 'We currently ship to all 36 states in Nigeria, including the Federal Capital Territory, Abuja. We\'re working on expanding our shipping services internationally. Sign up for our newsletter to be notified when international shipping becomes available.',
  },
  {
    category: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days, while express shipping delivers within 2-3 business days. These times are in addition to 1-2 business days for order processing. You can find detailed shipping information on our Shipping page.',
  },
  {
    category: 'shipping',
    question: 'How much does shipping cost?',
    answer: 'Standard shipping costs ₦5,000, express shipping costs ₦15,000, and we offer free shipping on orders over ₦50,000. Shipping costs are calculated at checkout based on your location and selected shipping method.',
  },
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer hassle-free returns and exchanges within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with tags attached. Visit our Returns & Exchanges page for detailed information and to initiate a return.',
  },
  {
    category: 'returns',
    question: 'How do I return an item?',
    answer: 'Log into your account or contact customer service to request a return authorization. Package the item in its original packaging with tags attached, and ship it back using the provided return label. Once we receive and inspect the item, we\'ll process your refund within 5-7 business days.',
  },
  {
    category: 'returns',
    question: 'Are sale items eligible for return?',
    answer: 'Sale items are eligible for exchange or store credit only, not for full refunds. Final sale items cannot be returned or exchanged. Please check product descriptions for any special return conditions.',
  },
  {
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards, bank transfers, and Paystack payments. All transactions are processed securely through our encrypted payment gateway. We do not store your full payment information.',
  },
  {
    category: 'payments',
    question: 'Is my payment information secure?',
    answer: 'Yes, absolutely. We use industry-standard SSL encryption and work with trusted payment processors. We never store your full credit card information. All payment data is handled securely through our payment gateway partners.',
  },
  {
    category: 'payments',
    question: 'When will I be charged?',
    answer: 'Your payment method will be charged immediately when you place your order. If your order is cancelled or cannot be fulfilled, you\'ll receive a full refund to your original payment method within 5-7 business days.',
  },
  {
    category: 'products',
    question: 'How do I find my size?',
    answer: 'We provide detailed size guides for clothing, shoes, and accessories on our Size Guide page. You can also contact our customer service team with your measurements, and we\'ll recommend the best size for you.',
  },
  {
    category: 'products',
    question: 'Are products authentic?',
    answer: 'Yes, all products sold at Rudy\'s Store are 100% authentic. We source directly from authorized distributors and brands. We guarantee the authenticity of every item and offer a full refund if any item is found to be inauthentic.',
  },
  {
    category: 'products',
    question: 'What if a product is out of stock?',
    answer: 'If an item is out of stock, you can sign up to be notified when it becomes available again. Simply click the "Notify Me" button on the product page and enter your email address. We\'ll send you an email as soon as the item is back in stock.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'orders', name: 'Orders' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'returns', name: 'Returns' },
    { id: 'payments', name: 'Payments' },
    { id: 'products', name: 'Products' },
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#201d1e' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#cfa224' }}>Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Find answers to common questions about shopping at Rudy's Store
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      activeCategory === category.id
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={activeCategory === category.id ? { backgroundColor: '#cfa224' } : {}}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                const isOpen = openItems.has(index);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          <HelpCircle className="w-5 h-5" style={{ color: '#cfa224' }} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                        style={{ color: '#cfa224' }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pl-14">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Still Have Questions Section */}
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8" style={{ borderLeft: '4px solid #cfa224' }}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                    <HelpCircle className="w-6 h-6" style={{ color: '#cfa224' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Still Have Questions?</h3>
                  <p className="text-gray-600 mb-4">
                    Can't find the answer you're looking for? Our customer service team is here to help. 
                    Contact us and we'll respond as soon as possible.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all text-white"
                      style={{ backgroundColor: '#cfa224' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/shipping"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all border-2"
                      style={{ borderColor: '#cfa224', color: '#cfa224' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(207, 162, 36, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Shipping Info
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

