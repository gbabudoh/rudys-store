// Rule-based chatbot engine
import { Product } from './products';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
}

export interface ChatbotResponse {
  message: string;
  quickReplies?: string[];
  data?: any;
}

// Keywords for intent detection
const INTENTS = {
  greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
  size: ['size', 'sizing', 'fit', 'measurements', 'how big', 'what size'],
  price: ['price', 'cost', 'how much', 'expensive', 'cheap', 'affordable'],
  shipping: ['ship', 'delivery', 'shipping', 'deliver', 'when will', 'how long'],
  returns: ['return', 'refund', 'exchange', 'money back', 'send back'],
  product: ['product', 'item', 'show me', 'looking for', 'find', 'search'],
  order: ['order', 'track', 'tracking', 'order status', 'where is my'],
  payment: ['payment', 'pay', 'credit card', 'paystack', 'checkout'],
  help: ['help', 'support', 'assist', 'question'],
  thanks: ['thank', 'thanks', 'appreciate'],
  goodbye: ['bye', 'goodbye', 'see you', 'later'],
};

const CATEGORIES = ['t-shirts', 'shirts', 'trousers', 'footwear', 'dresses', 'bags', 'glasses', 'crocs'];
const COLORS = ['black', 'white', 'navy', 'gray', 'red', 'blue', 'pink', 'green', 'brown', 'tan'];

export class Chatbot {
  private conversationContext: {
    lastIntent?: string;
    lastCategory?: string;
    lastProduct?: Product;
  } = {};

  detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(INTENTS)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }
    
    return 'unknown';
  }

  extractCategory(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    for (const category of CATEGORIES) {
      if (lowerMessage.includes(category)) {
        return category;
      }
    }
    
    return null;
  }

  extractColor(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    for (const color of COLORS) {
      if (lowerMessage.includes(color)) {
        return color;
      }
    }
    
    return null;
  }

  async processMessage(message: string, products: Product[]): Promise<ChatbotResponse> {
    const intent = this.detectIntent(message);
    const category = this.extractCategory(message);
    const color = this.extractColor(message);

    // Update context
    if (category) this.conversationContext.lastCategory = category;

    switch (intent) {
      case 'greeting':
        return this.handleGreeting();
      
      case 'size':
        return this.handleSizeQuery(category);
      
      case 'price':
        return this.handlePriceQuery(category, products);
      
      case 'shipping':
        return this.handleShippingQuery();
      
      case 'returns':
        return this.handleReturnsQuery();
      
      case 'product':
        return this.handleProductQuery(message, category, color, products);
      
      case 'order':
        return this.handleOrderQuery();
      
      case 'payment':
        return this.handlePaymentQuery();
      
      case 'help':
        return this.handleHelpQuery();
      
      case 'thanks':
        return this.handleThanks();
      
      case 'goodbye':
        return this.handleGoodbye();
      
      default:
        return this.handleUnknown();
    }
  }

  private handleGreeting(): ChatbotResponse {
    return {
      message: "Hi there! 👋 Welcome to Rudy Store. I'm here to help you find the perfect products. What are you looking for today?",
      quickReplies: [
        'Show me products',
        'Size guide',
        'Shipping info',
        'Track my order'
      ]
    };
  }

  private handleSizeQuery(category: string | null): ChatbotResponse {
    if (category === 'footwear' || category === 'crocs') {
      return {
        message: `📏 **Footwear Size Guide**\n\nWe offer sizes 5-13 (US) / 38-46 (EU).\n\n**How to measure:**\n1. Stand on a piece of paper\n2. Mark your heel and longest toe\n3. Measure the distance\n4. Compare with our size chart\n\n**Size Chart:**\n- US 5 = EU 38 = 23cm\n- US 6 = EU 39 = 24cm\n- US 7 = EU 40 = 25cm\n- US 8 = EU 41 = 26cm\n- US 9 = EU 42 = 27cm\n- US 10 = EU 43 = 28cm\n- US 11 = EU 44 = 29cm\n- US 12 = EU 45 = 30cm\n\nNeed help with a specific product?`,
        quickReplies: ['Show footwear', 'Clothing sizes', 'Contact support']
      };
    } else {
      return {
        message: `📏 **Clothing Size Guide**\n\n**T-Shirts & Shirts:**\n- XS: Chest 32-34"\n- S: Chest 34-36"\n- M: Chest 38-40"\n- L: Chest 42-44"\n- XL: Chest 46-48"\n- XXL: Chest 50-52"\n\n**Trousers:**\nWe use waist measurements (28-38 inches)\n\n**Dresses:**\nXS-XL sizing available\n\nTip: Check individual product pages for detailed measurements!`,
        quickReplies: ['Show clothing', 'Footwear sizes', 'View products']
      };
    }
  }

  private handlePriceQuery(category: string | null, products: Product[]): ChatbotResponse {
    if (category) {
      const categoryProducts = products.filter(p => 
        p.category.toLowerCase().includes(category)
      );
      
      if (categoryProducts.length > 0) {
        const prices = categoryProducts.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        return {
          message: `💰 **${category.charAt(0).toUpperCase() + category.slice(1)} Pricing**\n\nOur ${category} range from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}.\n\nWe currently have ${categoryProducts.length} items in this category. Would you like to see them?`,
          quickReplies: [`Show ${category}`, 'View all products', 'Check sales']
        };
      }
    }
    
    return {
      message: `💰 **Our Price Range**\n\n- T-Shirts: $29.99 - $39.99\n- Shirts: $59.99 - $79.99\n- Trousers: $69.99+\n- Footwear: $49.99 - $129.99\n- Dresses: $89.99 - $119.99\n- Bags: $129.99 - $179.99\n- Sunglasses: $149.99 - $199.99\n\n✨ Check our sales section for great deals!`,
      quickReplies: ['View sales', 'Show all products', 'Size guide']
    };
  }

  private handleShippingQuery(): ChatbotResponse {
    return {
      message: `🚚 **Shipping Information**\n\n**Delivery Times:**\n- Standard Shipping: 5-7 business days\n- Express Shipping: 2-3 business days\n- Same Day (Lagos only): Order before 12pm\n\n**Shipping Costs:**\n- Orders over ₦50,000: FREE shipping\n- Standard: ₦2,500\n- Express: ₦5,000\n\n**Tracking:**\nYou'll receive a tracking number via email once your order ships.\n\nNeed to track an existing order?`,
      quickReplies: ['Track my order', 'Return policy', 'Contact support']
    };
  }

  private handleReturnsQuery(): ChatbotResponse {
    return {
      message: `↩️ **Returns & Exchanges**\n\n**30-Day Return Policy**\n- Items must be unworn and in original packaging\n- Tags must be attached\n- Proof of purchase required\n\n**How to Return:**\n1. Contact our support team\n2. Receive return authorization\n3. Ship item back (we provide label)\n4. Refund processed within 5-7 days\n\n**Exchanges:**\nFree exchanges for different sizes/colors!\n\nNeed to start a return?`,
      quickReplies: ['Contact support', 'Shipping info', 'Size guide']
    };
  }

  private handleProductQuery(message: string, category: string | null, color: string | null, products: Product[]): ChatbotResponse {
    let filteredProducts = products;
    
    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(category)
      );
    }
    
    // Filter by color
    if (color) {
      filteredProducts = filteredProducts.filter(p =>
        p.colors.some(c => c.toLowerCase().includes(color))
      );
    }
    
    // Check for specific product types
    if (message.toLowerCase().includes('new')) {
      filteredProducts = filteredProducts.filter(p => p.isNew);
    }
    
    if (message.toLowerCase().includes('sale') || message.toLowerCase().includes('discount')) {
      filteredProducts = filteredProducts.filter(p => p.isOnSale);
    }
    
    if (filteredProducts.length > 0) {
      const productList = filteredProducts.slice(0, 3).map(p => 
        `• ${p.name} - $${p.price}${p.isOnSale ? ` (${p.discount}% off!)` : ''}`
      ).join('\n');
      
      return {
        message: `🛍️ **Found ${filteredProducts.length} products for you:**\n\n${productList}\n\n${filteredProducts.length > 3 ? `...and ${filteredProducts.length - 3} more!` : ''}\n\nVisit our products page to see the full collection!`,
        quickReplies: ['Size guide', 'Shipping info', 'View more'],
        data: { products: filteredProducts.slice(0, 3) }
      };
    }
    
    return {
      message: `I couldn't find products matching "${message}". Try browsing our categories:\n\n• T-Shirts\n• Shirts\n• Trousers\n• Footwear\n• Dresses\n• Bags\n• Sunglasses\n\nWhat would you like to explore?`,
      quickReplies: ['Show all products', 'Size guide', 'Contact support']
    };
  }

  private handleOrderQuery(): ChatbotResponse {
    return {
      message: `📦 **Track Your Order**\n\nTo track your order, I'll need your order number. You can find it in:\n- Your confirmation email\n- Your account dashboard\n\n**Order Status Meanings:**\n- Pending: We're processing your order\n- Processing: Being prepared for shipment\n- Shipped: On its way to you!\n- Delivered: Enjoy your purchase!\n\nPlease visit your account page or contact support with your order number for specific tracking details.`,
      quickReplies: ['Contact support', 'Shipping info', 'Return policy']
    };
  }

  private handlePaymentQuery(): ChatbotResponse {
    return {
      message: `💳 **Payment Information**\n\n**We Accept:**\n- Credit/Debit Cards (Visa, Mastercard)\n- Paystack (Secure payment gateway)\n- Bank Transfer\n- Pay on Delivery (Lagos only)\n\n**Security:**\n- All transactions are encrypted\n- We never store your card details\n- PCI DSS compliant\n\n**Payment Issues?**\nContact our support team for assistance.`,
      quickReplies: ['Contact support', 'View products', 'Shipping info']
    };
  }

  private handleHelpQuery(): ChatbotResponse {
    return {
      message: `🤝 **How Can I Help?**\n\nI can assist you with:\n\n✅ Product recommendations\n✅ Size guides\n✅ Pricing information\n✅ Shipping details\n✅ Return policy\n✅ Order tracking\n✅ Payment options\n\nWhat would you like to know more about?`,
      quickReplies: ['Size guide', 'Shipping info', 'View products', 'Contact support']
    };
  }

  private handleThanks(): ChatbotResponse {
    return {
      message: `You're welcome! 😊 Is there anything else I can help you with today?`,
      quickReplies: ['View products', 'Size guide', 'Shipping info', 'No, thanks']
    };
  }

  private handleGoodbye(): ChatbotResponse {
    return {
      message: `Thanks for visiting Rudy Store! Have a great day! 👋\n\nFeel free to come back anytime if you have questions.`,
      quickReplies: []
    };
  }

  private handleUnknown(): ChatbotResponse {
    return {
      message: `I'm not sure I understood that. I can help you with:\n\n• Finding products\n• Size guides\n• Shipping information\n• Returns & exchanges\n• Order tracking\n• Payment options\n\nWhat would you like to know?`,
      quickReplies: ['View products', 'Size guide', 'Shipping info', 'Contact support']
    };
  }

  resetContext(): void {
    this.conversationContext = {};
  }
}
