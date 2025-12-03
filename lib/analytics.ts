import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window !== 'undefined' && measurementId) {
    ReactGA.initialize(measurementId, {
      testMode: process.env.NODE_ENV === 'development',
    });
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.send({ hitType: 'pageview', page: path, title });
  }
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined') {
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
  }
};

// Track e-commerce events
export const trackPurchase = (transactionId: string, value: number, currency: string = 'NGN', items?: any[]) => {
  if (typeof window !== 'undefined') {
    ReactGA.event('purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items: items || [],
    });
  }
};

// Track add to cart
export const trackAddToCart = (itemId: string, itemName: string, value: number, quantity: number = 1) => {
  if (typeof window !== 'undefined') {
    ReactGA.event('add_to_cart', {
      currency: 'NGN',
      value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          quantity,
          price: value,
        },
      ],
    });
  }
};

// Track product views
export const trackProductView = (productId: string, productName: string, price: number, category?: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.event('view_item', {
      currency: 'NGN',
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price,
          item_category: category,
        },
      ],
    });
  }
};

// Track search
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.event('search', {
      search_term: searchTerm,
    });
  }
};

