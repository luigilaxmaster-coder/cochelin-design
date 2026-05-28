import { useState, useEffect, useRef } from 'react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';
import { BaseCrudService } from '@/integrations';
import { ProjectPortfolio } from '@/entities';
import { ArrowRight } from 'lucide-react';

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

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio', undefined, { limit: 500 });
      setProjects(result.items);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/307f6c_2c6611a65f1b43699b7e30b39284f626~mv2.png?originWidth=1152&originHeight=384)' }} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedElement>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Our <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
              Explore our collection of custom designs, from residential furniture to commercial spaces
            </p>
          </AnimatedElement>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="mb-6 text-center">
              <p className="text-sm text-foreground/60 uppercase tracking-widest font-semibold">Explorar por Categoría</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const count = category === 'all'
                  ? projects.length
                  : projects.filter(p => p.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm uppercase tracking-wider ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                        : 'bg-background text-foreground hover:bg-muted border border-border/50 hover:border-primary/30'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category}
                    <span className={`ml-2 inline-block px-2 py-1 rounded text-xs ${
                      selectedCategory === category
                        ? 'bg-primary-foreground/20'
                        : 'bg-foreground/10'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Projects Counter */}
          {!isLoading && (
            <AnimatedElement className="text-center mb-12">
              <p className="text-sm text-foreground/60 uppercase tracking-widest font-semibold mb-2">Mostrando</p>
              <p className="text-3xl font-bold text-primary">{filteredProjects.length}</p>
              <p className="text-foreground/70">
                {selectedCategory === 'all'
                  ? 'Proyectos en Total'
                  : `Proyectos en ${selectedCategory}`}
              </p>
            </AnimatedElement>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            {isLoading ? (
              <div className="col-span-3 flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-foreground/60">Cargando proyectos...</p>
                </div>
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => {
                // Get all project images (mainImage + any gallery images)
                const projectImages = project.mainImage ? [project.mainImage] : [];

                return (
                  <AnimatedElement key={project._id} className={`delay-${(index % 6) * 100}`}>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-card h-full flex flex-col">
                      {/* Image with Lightbox */}
                      {project.mainImage && projectImages.length > 0 ? (
                        <div className="relative">
                          <ImageLightbox
                            images={projectImages}
                            projectTitle={project.projectTitle || 'Proyecto'}
                            mainImageIndex={0}
                          />
                          {/* Category Badge */}
                          {project.category && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="inline-block bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {project.category}
                              </span>
                            </div>
                          )}
                          {/* Hover Info Overlay */}
                          <div className="absolute inset-0 top-0 h-80 bg-gradient-to-t from-secondary/95 via-secondary/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none group">
                            <div>
                              <h3 className="text-xl font-heading font-bold text-white mb-3">
                                {project.projectTitle}
                              </h3>
                              {project.clientName && (
                                <p className="text-white/90 text-sm mb-3">Cliente: {project.clientName}</p>
                              )}
                              <div className="flex items-center text-white text-xs font-semibold uppercase tracking-wider">
                                Hacer clic para ver fotos <ArrowRight className="w-3 h-3 ml-2" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-80 bg-muted flex items-center justify-center">
                          <p className="text-foreground/60">Sin imagen</p>
                        </div>
                      )}

                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-heading font-bold text-secondary mb-2">
                          {project.projectTitle}
                        </h3>
                        {project.detailedDescription && (
                          <p className="text-foreground text-sm line-clamp-2 flex-grow">{project.detailedDescription}</p>
                        )}
                      </div>
                    </div>
                  </AnimatedElement>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-foreground text-xl font-semibold mb-2">No hay proyectos en esta categoría</p>
                <p className="text-foreground/60">Intenta seleccionar otra categoría</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-24 bg-gradient-to-b from-background via-secondary/3 to-background">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="text-center mb-16">
              <p className="text-sm text-primary uppercase tracking-widest font-semibold mb-4">Nuestras Especialidades</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary mb-6">
                Categorías de <span className="text-primary">Proyectos</span>
              </h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                Desde diseño interior hasta cavas especializadas, traemos experiencia a cada proyecto
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Diseño de Interiores', key: 'Diseño de Interiores', icon: '🏠' },
              { title: 'Mobiliario Residencial', key: 'Mobiliario Residencial', icon: '🛋️' },
              { title: 'Mobiliario Comercial', key: 'Mobiliario Comercial', icon: '🏢' },
              { title: 'Cavas y Humidores', key: 'Cavas y Humidores', icon: '🍷' }
            ].map((cat, index) => {
              const count = projects.filter(p => p.category === cat.key).length;
              return (
                <AnimatedElement key={index} className={`delay-${index * 100}`}>
                  <button
                    onClick={() => setSelectedCategory(cat.key)}
                    className="group relative h-full bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:from-primary/10 hover:to-primary/5 border border-border/30 hover:border-primary/50 text-left"
                  >
                    <div className="mb-4">
                      <span className="text-4xl">{cat.icon}</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-4xl font-bold text-primary">{count}</p>
                      <p className="text-foreground/70 text-sm">
                        {count === 1 ? 'Proyecto' : 'Proyectos'}
                      </p>
                    </div>
                    <div className="flex items-center text-primary text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver Todos <ArrowRight className="w-3 h-3 ml-2" />
                    </div>
                  </button>
                </AnimatedElement>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
