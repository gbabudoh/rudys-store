'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  order: number;
}

interface BannerSliderProps {
  slides: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function BannerSlider({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: BannerSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Filter active slides and sort by order
  const activeSlides = slides
    .filter(slide => slide.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.banner-swiper-button-prev',
          nextEl: '.banner-swiper-button-next',
        }}
        pagination={{
          el: '.banner-swiper-pagination',
          clickable: true,
          bulletClass: 'banner-swiper-bullet',
          bulletActiveClass: 'banner-swiper-bullet-active',
        }}
        autoplay={autoPlay ? {
          delay: autoPlayInterval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={activeSlides.length > 1}
        speed={800}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="h-full w-full"
      >
        {activeSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {/* Desktop Layout - Overlay */}
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized
                sizes="100vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 text-white/90 animate-fade-in-delay">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.link}
                      className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 animate-fade-in-delay-2 cursor-pointer"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout - Image + Text Below */}
            <div className="md:hidden flex flex-col h-full">
              {/* Full Image Section */}
              <div className="relative w-full h-[60%] bg-gray-100">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  unoptimized
                  sizes="100vw"
                />
              </div>
              {/* Text Section Below */}
              <div className="flex-1 bg-[#201d1e] px-4 py-3 flex flex-col justify-center">
                <h1 className="text-xl font-bold text-white mb-1 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xs text-white/80 mb-3 animate-fade-in-delay line-clamp-2">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.link}
                  className="inline-block w-fit text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300 animate-fade-in-delay-2 cursor-pointer text-xs"
                  style={{ backgroundColor: '#cfa224' }}
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            className="banner-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full z-20 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className="banner-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full z-20 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {activeSlides.length > 1 && (
        <div className="banner-swiper-pagination absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20" />
      )}

      <style jsx global>{`
        .banner-swiper-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-block;
        }
        
        .banner-swiper-bullet-active {
          width: 40px;
          background: white;
          border-radius: 6px;
        }
        
        .banner-swiper-button-prev,
        .banner-swiper-button-next {
          cursor: pointer;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 1.2s ease-out 0.6s both;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
