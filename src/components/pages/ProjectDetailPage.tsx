import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Maximize2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LightboxModal } from '@/components/ImageLightbox';
import { BaseCrudService } from '@/integrations';
import { ProjectPortfolio } from '@/entities';

/* ── Scroll-triggered fade-up animation ── */
const Anim: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children, className, delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className || ''} opacity-0 translate-y-6 transition-all duration-700 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0`}
    >
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

  /* Gallery state */
  const [activeImg, setActiveImg] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => { loadProject(); }, [projectId]);

  const loadProject = async () => {
    if (!projectId) { setError('Proyecto no encontrado'); setIsLoading(false); return; }
    try {
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio', undefined, { limit: 500 });
      const found = result.items.find(p => p._id === projectId);
      if (!found) { setError('El proyecto no fue encontrado'); setIsLoading(false); return; }
      setProject(found);
      setActiveImg(0);
    } catch {
      setError('Error al cargar el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  /* Animated image change — cross-fade */
  const changeImage = (idx: number) => {
    if (idx === activeImg) return;
    setImgVisible(false);
    setTimeout(() => { setActiveImg(idx); setImgVisible(true); }, 180);
  };

  /* ── Loading state ── */
  if (isLoading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
      <Footer />
    </div>
  );

  /* ── Error state ── */
  if (error || !project) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-foreground text-lg font-semibold mb-4">{error || 'Proyecto no encontrado'}</p>
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Portfolio
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  const allImages = project.galleryImages?.length
    ? project.galleryImages
    : project.mainImage ? [project.mainImage] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative py-14 bg-gradient-to-br from-primary/8 via-background to-secondary/8 border-b border-border/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors mb-8 font-semibold uppercase text-xs tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          <Anim>
            {project.category && (
              <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-3">
                {project.category}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary mb-3 leading-tight">
              {project.projectTitle}
            </h1>
            {project.clientName && (
              <p className="text-base text-foreground/60 mb-2">
                Cliente: <span className="font-semibold text-foreground/80">{project.clientName}</span>
              </p>
            )}
            {project.detailedDescription && (
              <p className="text-base text-foreground/60 max-w-2xl mt-4 leading-relaxed">
                {project.detailedDescription}
              </p>
            )}
          </Anim>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">

          {allImages.length === 0 ? (
            <Anim className="text-center py-20">
              <p className="text-foreground/50 text-lg">Sin imágenes disponibles</p>
            </Anim>
          ) : (
            <>
              {/* Main image viewer */}
              <Anim>
                <div
                  className="relative group cursor-zoom-in rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl mb-4"
                  onClick={() => setLightboxOpen(true)}
                >
                  {/* The image — object-contain so you always see the full photo */}
                  <div className="flex items-center justify-center min-h-[300px] max-h-[72vh]">
                    <img
                      src={allImages[activeImg]}
                      alt={`${project.projectTitle} — foto ${activeImg + 1}`}
                      className={`w-auto max-w-full object-contain block mx-auto transition-opacity duration-[180ms] ${imgVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ maxHeight: '72vh' }}
                      draggable={false}
                    />
                  </div>

                  {/* Fullscreen hint on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <div className="flex items-center gap-2 bg-white/90 text-secondary px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                      <Maximize2 className="w-4 h-4" />
                      Pantalla completa
                    </div>
                  </div>

                  {/* Counter badge */}
                  {allImages.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full pointer-events-none select-none">
                      {activeImg + 1} / {allImages.length}
                    </div>
                  )}
                </div>
              </Anim>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <Anim delay={100}>
                  <div className="flex gap-2 justify-center flex-wrap mt-2">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => changeImage(i)}
                        aria-label={`Foto ${i + 1}`}
                        className={`flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                          i === activeImg
                            ? 'w-20 h-20 border-primary scale-105 shadow-lg opacity-100'
                            : 'w-16 h-16 border-transparent opacity-45 hover:opacity-85 hover:scale-105'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-foreground/35 text-xs mt-3 tracking-wider uppercase">
                    {allImages.length} {allImages.length === 1 ? 'foto' : 'fotos'} — clic para pantalla completa
                  </p>
                </Anim>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Project details ── */}
      {(project.category || project.clientName) && (
        <section className="py-14 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <Anim>
              <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-8">Detalles del Proyecto</p>
            </Anim>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.category && (
                <Anim delay={50}>
                  <div className="bg-card rounded-2xl p-7 shadow-sm border border-border/20">
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Categoría</p>
                    <p className="text-xl font-heading font-bold text-secondary">{project.category}</p>
                  </div>
                </Anim>
              )}
              {project.clientName && (
                <Anim delay={100}>
                  <div className="bg-card rounded-2xl p-7 shadow-sm border border-border/20">
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Cliente</p>
                    <p className="text-xl font-heading font-bold text-secondary">{project.clientName}</p>
                  </div>
                </Anim>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Anim>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">¿Te gusta este proyecto?</h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Contáctanos para discutir tu próximo proyecto.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary rounded-full hover:bg-white hover:text-secondary transition-all duration-300 font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl"
            >
              Iniciar Proyecto
            </button>
          </Anim>
        </div>
      </section>

      <Footer />

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <LightboxModal
          images={allImages}
          projectTitle={project.projectTitle || ''}
          startIndex={activeImg}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
