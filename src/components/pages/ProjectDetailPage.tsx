import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';
import { BaseCrudService } from '@/integrations';
import { ProjectPortfolio } from '@/entities';

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

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) {
      setError('Proyecto no encontrado');
      setIsLoading(false);
      return;
    }

    try {
      // Try to get project by ID
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio', undefined, { limit: 500 });
      const foundProject = result.items.find(p => p._id === projectId);

      if (!foundProject) {
        setError('El proyecto no fue encontrado');
        setIsLoading(false);
        return;
      }

      setProject(foundProject);
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Error al cargar el proyecto');
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
            <p className="text-foreground/60">Cargando proyecto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-foreground text-lg font-semibold mb-4">{error || 'Proyecto no encontrado'}</p>
            <button
              onClick={() => navigate('/portfolio')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Portfolio
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use galleryImages array if available, otherwise fall back to mainImage only
  const allImages = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : project.mainImage ? [project.mainImage] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Back Button */}
      <section className="relative py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border/30">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-semibold uppercase text-sm tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Portfolio
          </button>

          <AnimatedElement>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-4">
              {project.projectTitle}
            </h1>

            {project.category && (
              <p className="text-lg text-primary font-semibold uppercase tracking-widest mb-4">
                {project.category}
              </p>
            )}

            {project.clientName && (
              <p className="text-lg text-foreground/70">
                Cliente: <span className="font-semibold text-foreground">{project.clientName}</span>
              </p>
            )}

            {project.detailedDescription && (
              <p className="text-lg text-foreground/70 max-w-3xl mt-6 leading-relaxed">
                {project.detailedDescription}
              </p>
            )}
          </AnimatedElement>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedElement className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-secondary mb-2">
              Galería del Proyecto
            </h2>
            <p className="text-foreground/60">
              {allImages.length > 1
                ? `${allImages.length} fotos — haz clic en la imagen para ver la galería completa`
                : 'Haz clic en la imagen para verla en pantalla completa'}
            </p>
          </AnimatedElement>

          {allImages.length > 0 ? (
            <AnimatedElement>
              <div className="max-w-4xl mx-auto">
                <ImageLightbox
                  images={allImages}
                  projectTitle={project.projectTitle || 'Proyecto'}
                  mainImageIndex={0}
                />
              </div>
            </AnimatedElement>
          ) : (
            <AnimatedElement className="text-center py-20">
              <p className="text-foreground/60 text-lg">Este proyecto no tiene imágenes disponibles</p>
            </AnimatedElement>
          )}
        </div>
      </section>

      {/* Project Details Grid */}
      {(project.category || project.clientName) && (
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatedElement>
              <h2 className="text-3xl font-heading font-bold text-secondary mb-12">
                Detalles del Proyecto
              </h2>
            </AnimatedElement>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.category && (
                <AnimatedElement>
                  <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/30">
                    <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
                      Categoría
                    </p>
                    <p className="text-2xl font-heading font-bold text-secondary">
                      {project.category}
                    </p>
                  </div>
                </AnimatedElement>
              )}

              {project.clientName && (
                <AnimatedElement>
                  <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/30">
                    <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
                      Cliente
                    </p>
                    <p className="text-2xl font-heading font-bold text-secondary">
                      {project.clientName}
                    </p>
                  </div>
                </AnimatedElement>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <AnimatedElement>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              ¿Te gusta este proyecto?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Contáctanos para discutir tu próximo proyecto. Estamos listos para ayudarte a traer tus ideas a la vida.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary rounded-full hover:bg-white hover:text-secondary transition-all duration-300 font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl"
            >
              Iniciar Proyecto
            </button>
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}
