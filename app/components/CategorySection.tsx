import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  gradient: string;
  productCount: number;
}

// Map category IDs to their respective logos
const categoryLogos: Record<string, string> = {
  'ruddy_collections': '/rudy-store-logo.png',
  'ruddy_luxury': '/ruddy-lux-logo.png',
  'slide_and_sole': '/ss-logo.png',
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
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-[4/5] relative bg-gradient-to-br from-purple-500 to-pink-600">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                
                {/* Logo Overlay - Top Right Corner */}
                {categoryLogos[category.id] && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <div className="relative w-16 h-16">
                        <Image
                          src={categoryLogos[category.id]}
                          alt={`${category.name} logo`}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-[-4px] transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-4 group-hover:translate-y-[-4px] transition-transform duration-300 delay-75">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.productCount > 0 ? `${category.productCount} products` : 'Explore'}
                      </span>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
