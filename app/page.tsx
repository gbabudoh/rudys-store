'use client';

import { useState, useEffect } from 'react';
import BannerSlider, { type BannerSlide } from './components/BannerSlider';
import CategorySection, { type Category } from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import { getAllProducts, type Product } from '@/lib/products';

export default function Home() {
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get real products
  const allProducts = getAllProducts();
  const realFeaturedProducts = allProducts.map(product => ({
    ...product,
  }));

  // Fetch banners and homepage sections from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, sectionsRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/homepage-sections')
        ]);

        if (bannersRes.ok && sectionsRes.ok) {
          const bannersData = await bannersRes.json();
          const sectionsData = await sectionsRes.json();
          
          console.log('Banners response:', bannersData);
          console.log('Sections response:', sectionsData);
          
          setBannerSlides(bannersData.banners || []);
          
          interface SectionData {
            id: string;
            title: string;
            description: string;
            image: string;
            href: string;
            gradient: string;
            productCount: number;
          }

          // Map homepage sections to Category interface
          const mappedCategories = (sectionsData.sections || []).map((section: SectionData) => ({
            id: section.id,
            name: section.title, // Map title to name
            description: section.description,
            image: section.image,
            href: section.href,
            gradient: section.gradient,
            productCount: section.productCount || 0
          }));
          
          setCategories(mappedCategories);
        } else {
          // Fallback to empty if API fails
          setBannerSlides([]);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setBannerSlides([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddToCart = (_product: Product) => {
    // Analytics or Toast could go here
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddToWishlist = (_product: Product) => {
    // Analytics or Toast could go here
  };

  const handleQuickView = (product: Product) => {
    // You could open a modal or navigate to product page
    console.log('Quick view:', product);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner Slider */}
      <section className="w-full">
        {bannerSlides.length > 0 ? (
          <BannerSlider slides={bannerSlides} />
        ) : (
          <div className="h-[400px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400 italic">No banners currently available</p>
          </div>
        )}
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
