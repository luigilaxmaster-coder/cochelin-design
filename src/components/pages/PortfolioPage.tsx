import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ProjectPortfolio } from '@/entities';
import { ArrowRight } from 'lucide-react';
import { categoryToSlug } from './CategoryPage';

const AnimatedElement: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${className || ''} opacity-0 translate-y-8 transition-all duration-700 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0`}>
      {children}
    </div>
  );
};

interface CategoryData {
  name: string;
  count: number;
  coverImage: string | null;
}

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio', undefined, { limit: 500 });
      const projects = result.items;

      // Group projects by category
      const categoryMap = new Map<string, { count: number; coverImage: string | null }>();
      for (const project of projects) {
        if (!project.category) continue;
        if (!categoryMap.has(project.category)) {
          categoryMap.set(project.category, {
            count: 0,
            coverImage: project.mainImage || null,
          });
        }
        const entry = categoryMap.get(project.category)!;
        entry.count++;
        // Use first available image as cover
        if (!entry.coverImage && project.mainImage) {
          entry.coverImage = project.mainImage;
        }
      }

      const categoryList: CategoryData[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        coverImage: data.coverImage,
      }));

      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[420px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(https://static.wixstatic.com/media/307f6c_2c6611a65f1b43699b7e30b39284f626~mv2.png?originWidth=1152&originHeight=384)' }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedElement>
            <p className="text-sm text-primary uppercase tracking-widest font-semibold mb-4">CC Project Design</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Nuestro <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
              Selecciona una categoría para explorar nuestros proyectos
            </p>
          </AnimatedElement>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground/60">Cargando categorías...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((cat, index) => (
                <AnimatedElement key={cat.name} className={`delay-${index * 100}`}>
                  <button
                    onClick={() => navigate(`/portfolio/category/${categoryToSlug(cat.name)}`)}
                    className="group relative w-full h-80 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02] text-left"
                  >
                    {/* Background image */}
                    {cat.coverImage ? (
                      <img
                        src={cat.coverImage}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-secondary/30" />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/50 to-transparent transition-opacity duration-300 group-hover:from-secondary/80" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-2">
                          {cat.count} {cat.count === 1 ? 'proyecto' : 'proyectos'}
                        </p>
                        <h2 className="text-3xl font-heading font-bold text-white mb-4">
                          {cat.name}
                        </h2>
                        <div className="flex items-center text-white text-sm font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Ver proyectos <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </button>
                </AnimatedElement>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
