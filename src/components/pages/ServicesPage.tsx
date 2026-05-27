import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';

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

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await BaseCrudService.getAll<Services>('services');
      setServices(result.items);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/307f6c_7cc53129a0774afbad53f14fb0aa9207~mv2.png?originWidth=1152&originHeight=384)' }} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedElement>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
              Comprehensive design, construction, and furniture solutions tailored to your vision
            </p>
          </AnimatedElement>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[400px]">
            {isLoading ? null : services.length > 0 ? (
              services.map((service, index) => (
                <AnimatedElement key={service._id} className={`delay-${index * 100}`}>
                  <div className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-card">
                    {service.serviceImage && (
                      <div className="relative h-80 overflow-hidden">
                        <Image 
                          src={service.serviceImage} 
                          alt={service.serviceName || 'Service'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          width={800}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                            {service.serviceName}
                          </h3>
                          <p className="text-white/90 text-sm uppercase tracking-wider">{service.serviceCategory}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-8">
                      <p className="text-foreground text-lg mb-4">{service.shortDescription}</p>
                      {service.detailedExplanation && (
                        <p className="text-foreground/80 mb-6">{service.detailedExplanation}</p>
                      )}
                      {service.callToActionUrl && (
                        <a 
                          href={service.callToActionUrl} 
                          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Learn More →
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedElement>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-foreground text-lg">No services available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
                Ready to start your project?
              </h2>
              <p className="text-lg text-foreground mb-8">
                Let&apos;s discuss how we can bring your vision to life with our expertise in architecture, design, and construction.
              </p>
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                onClick={() => navigate('/contact')}
              >
                Get in Touch
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}
