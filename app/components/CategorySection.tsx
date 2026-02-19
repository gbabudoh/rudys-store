import Link from 'next/link';
import ProductImage from './ProductImage';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  gradient: string;
  productCount: number;
}

// Map category section keys to their respective logos
const categoryLogos: Record<string, string> = {
  'ruddys-store': '/rudy-store-logo.png',
  'ruddy-luxury': '/ruddy-lux-logo.png',
  'slide-sole': '/ss-logo.png',
};

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections designed for every style and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col items-center text-center"
            >
              {/* Image Container with Border */}
              <div className="w-full aspect-[4/5] relative rounded-3xl overflow-hidden border border-slate-200 transition-all duration-300 group-hover:border-stone-400 group-hover:shadow-xl mb-6">
                <ProductImage
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Logo Overlay - Bottom Left */}
                {categoryLogos[category.id] && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-slate-100">
                      <div className="relative w-12 h-12">
                        <ProductImage
                          src={categoryLogos[category.id]}
                          alt={`${category.name} logo`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Text Content Below Image */}
              <div className="space-y-3 px-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-stone-600 transition-colors uppercase">
                  {category.name}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[250px]">
                  {category.description}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#cfa224] pt-2 border-b-2 border-transparent group-hover:border-[#cfa224] transition-all">
                  Shop Now
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
