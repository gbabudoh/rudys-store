'use client';

import { useState, useEffect } from 'react';
import BannerSlider from './components/BannerSlider';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import { getAllProducts } from '@/lib/products';

// Sample products data
const featuredProducts = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isOnSale: true,
    discount: 25
  },
  {
    id: '2',
    name: 'Designer Handbag',
    price: 199.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isOnSale: false
  },
  {
    id: '3',
    name: 'Luxury Watch',
    price: 599.99,
    originalPrice: 799.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 67,
    isNew: false,
    isOnSale: true,
    discount: 25
  },
  {
    id: '4',
    name: 'Crocs Classic Clogs',
    price: 49.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 234,
    isNew: true,
    isOnSale: false
  },
  {
    id: '5',
    name: 'Silk Scarf',
    price: 79.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isOnSale: false
  },
  {
    id: '6',
    name: 'Leather Jacket',
    price: 299.99,
    originalPrice: 399.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 78,
    isNew: false,
    isOnSale: true,
    discount: 25
  },
  {
    id: '7',
    name: 'Crocs Slides',
    price: 34.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 189,
    isNew: true,
    isOnSale: false
  },
  {
    id: '8',
    name: 'Designer Sunglasses',
    price: 149.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 92,
    isNew: false,
    isOnSale: false
  },
  {
    id: '9',
    name: 'Premium Sneakers',
    price: 129.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 203,
    isNew: false,
    isOnSale: false
  },
  {
    id: '10',
    name: 'Luxury Perfume',
    price: 89.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 145,
    isNew: false,
    isOnSale: false
  },
  {
    id: '11',
    name: 'Designer Belt',
    price: 79.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 87,
    isNew: false,
    isOnSale: false
  },
  {
    id: '12',
    name: 'Premium Headphones',
    price: 199.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 156,
    isNew: false,
    isOnSale: false
  }
];

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [bannerSlides, setBannerSlides] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get real products
  const allProducts = getAllProducts();
  const realFeaturedProducts = allProducts.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.images[0],
    rating: product.rating,
    reviews: product.reviews,
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    discount: product.discount,
  }));

  // Fetch banners and homepage sections from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await fetch('/api/banners');
        const bannersData = await bannersResponse.json();
        console.log('Banners data:', bannersData);
        if (bannersData.banners) {
          const transformedBanners = bannersData.banners.map((banner: any) => ({
            id: banner.id.toString(),
            title: banner.title,
            subtitle: banner.subtitle || '',
            image: banner.image,
            link: banner.link || '',
            buttonText: banner.buttonText || 'Shop Now',
            isActive: banner.isActive,
            order: banner.order,
          }));
          console.log('Transformed banners:', transformedBanners);
          setBannerSlides(transformedBanners);
        }

        // Fetch homepage sections
        const sectionsResponse = await fetch('/api/homepage-sections');
        const sectionsData = await sectionsResponse.json();
        console.log('Homepage sections data:', sectionsData);
        if (sectionsData.sections && sectionsData.sections.length > 0) {
          const transformedSections = sectionsData.sections.map((section: any) => ({
            id: section.key || section.section_key,
            name: section.title,
            description: section.subtitle || section.description || '',
            image: section.image || section.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            href: section.href || section.link_url || `/${section.key || section.section_key}`,
            gradient: section.gradient || section.gradient_color || 'bg-gradient-to-br from-purple-500 to-pink-600',
            productCount: section.productCount || section.product_count || 0,
          }));
          console.log('Transformed sections:', transformedSections);
          setCategories(transformedSections);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        // Fallback to empty arrays if API fails
        setBannerSlides([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    // You could add a toast notification here
  };

  const handleAddToWishlist = (product: any) => {
    setWishlist(prev => [...prev, product]);
    // You could add a toast notification here
  };

  const handleQuickView = (product: any) => {
    // You could open a modal or navigate to product page
    console.log('Quick view:', product);
  };

  // Sample products data (can be moved to API later)
  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 124,
      isNew: true,
      isOnSale: true,
      discount: 25
    },
    {
      id: '2',
      name: 'Designer Handbag',
      price: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 89,
      isNew: false,
      isOnSale: false
    },
    {
      id: '3',
      name: 'Luxury Watch',
      price: 599.99,
      originalPrice: 799.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 67,
      isNew: false,
      isOnSale: true,
      discount: 25
    },
    {
      id: '4',
      name: 'Crocs Classic Clogs',
      price: 49.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      isNew: true,
      isOnSale: false
    },
    {
      id: '5',
      name: 'Silk Scarf',
      price: 79.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 156,
      isNew: false,
      isOnSale: false
    },
    {
      id: '6',
      name: 'Leather Jacket',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 78,
      isNew: false,
      isOnSale: true,
      discount: 25
    },
    {
      id: '7',
      name: 'Crocs Slides',
      price: 34.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 189,
      isNew: true,
      isOnSale: false
    },
    {
      id: '8',
      name: 'Designer Sunglasses',
      price: 149.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 92,
      isNew: false,
      isOnSale: false
    },
    {
      id: '9',
      name: 'Premium Sneakers',
      price: 129.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 203,
      isNew: false,
      isOnSale: false
    },
    {
      id: '10',
      name: 'Luxury Perfume',
      price: 89.99,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 145,
      isNew: false,
      isOnSale: false
    },
    {
      id: '11',
      name: 'Designer Belt',
      price: 79.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 87,
      isNew: false,
      isOnSale: false
    },
    {
      id: '12',
      name: 'Premium Headphones',
      price: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 156,
      isNew: false,
      isOnSale: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  console.log('Categories state:', categories);
  console.log('Categories length:', categories.length);
  console.log('Banner slides state:', bannerSlides);
  console.log('Banner slides length:', bannerSlides.length);

  return (
    <div className="min-h-screen">
      {/* Banner Slider */}
      <section className="w-full">
        <BannerSlider slides={bannerSlides} />
      </section>
      
      {/* Category Sections */}
      <CategorySection categories={categories} />
      
      {/* Featured Products */}
      <FeaturedProducts
        title="Featured Products"
        products={realFeaturedProducts}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onQuickView={handleQuickView}
      />
    </div>
  );
}
