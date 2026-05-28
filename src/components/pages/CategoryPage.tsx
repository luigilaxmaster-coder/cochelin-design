import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ProjectPortfolio } from '@/entities';

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove accents
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

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
      { threshold: 0.08 }
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

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, [categorySlug]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio', undefined, { limit: 500 });
      const allProjects = result.items;

      // Find which category matches the URL slug
      const matchedCategory = Array.from(
        new Set(allProjects.map(p => p.category).filter(Boolean))
      ).find(cat => categoryToSlug(cat!) === categorySlug);

      if (matchedCategory) {
        setCategoryName(matchedCategory);
        setProjects(allProjects.filter(p => p.category === matchedCategory));
      } else {
        navigate('/portfolio');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      navigate('/portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground/60">Cargando proyectos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[340px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border/30">
        <div className="relative z-10 container mx-auto px-4">
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-semibold uppercase text-sm tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Portfolio
          </button>
          <AnimatedElement>
            <p className="text-sm text-primary uppercase tracking-widest font-semibold mb-3">Categoría</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-4">
              {categoryName}
            </h1>
            <p className="text-lg text-foreground/60">
              {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
            </p>
          </AnimatedElement>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <AnimatedElement key={project._id} className={`delay-${(index % 6) * 100}`}>
                <div
                  onClick={() => navigate(`/portfolio/${project._id}`)}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-card cursor-pointer hover:scale-[1.02]"
                >
                  {/* Image */}
                  {project.mainImage ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={project.mainImage}
                        alt={project.projectTitle || 'Proyecto'}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Photo count badge */}
                      {project.galleryImages && project.galleryImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {project.galleryImages.length} fotos
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
                        <div>
                          <h3 className="text-xl font-heading font-bold text-white mb-2">
                            {project.projectTitle}
                          </h3>
                          {project.clientName && (
                            <p className="text-white/80 text-sm mb-3">Cliente: {project.clientName}</p>
                          )}
                          <div className="flex items-center text-white text-xs font-semibold uppercase tracking-wider">
                            Ver fotos <ArrowRight className="w-3 h-3 ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <p className="text-foreground/40">Sin imagen</p>
                    </div>
                  )}

                  {/* Project title below image */}
                  <div className="p-5">
                    <h3 className="text-lg font-heading font-bold text-secondary">
                      {project.projectTitle}
                    </h3>
                    {project.galleryImages && project.galleryImages.length > 1 && (
                      <p className="text-sm text-foreground/50 mt-1">
                        {project.galleryImages.length} fotos
                      </p>
                    )}
                    {project.detailedDescription && (
                      <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                        {project.detailedDescription}
                      </p>
                    )}
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
