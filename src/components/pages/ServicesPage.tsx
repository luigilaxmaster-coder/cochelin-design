import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Loader2, ArrowRight } from 'lucide-react';
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

// Placeholder press items
const PRESS_ITEMS = [
  {
    _id: '1',
    title: 'Architecture Digest Feature',
    publication: 'Architecture Digest',
    projectName: 'Caribbean Luxury Residence',
    year: 2024,
    type: 'Featured project',
    image: 'https://static.wixstatic.com/media/307f6c_a7fd143cf2984f93854c12129409eb8e~mv2.png?originWidth=576&originHeight=384',
    description: 'Our signature Caribbean residence project was featured in Architecture Digest\'s annual design excellence issue, showcasing innovative tropical architecture and sustainable design principles.',
    externalLink: '#'
  },
  {
    _id: '2',
    title: 'Interior Design Magazine',
    publication: 'Interior Design Magazine',
    projectName: 'Modern Minimalist Office',
    year: 2024,
    type: 'Editorial mention',
    image: 'https://static.wixstatic.com/media/307f6c_77ce03f547a249118344a4fdd6c4b539~mv2.png?originWidth=576&originHeight=384',
    description: 'Featured in the "Workspace Evolution" editorial series, highlighting how contemporary office design enhances productivity and employee wellbeing.',
    externalLink: '#'
  },
  {
    _id: '3',
    title: 'Luxury Interiors Publication',
    publication: 'Luxury Interiors',
    projectName: 'Bespoke Furniture Collection',
    year: 2023,
    type: 'Published work',
    image: 'https://static.wixstatic.com/media/307f6c_0363eb106eec4091a5b126df8f59d290~mv2.png?originWidth=576&originHeight=384',
    description: 'Our custom furniture line was showcased in the publication\'s premium collection issue, demonstrating craftsmanship and innovative design.',
    externalLink: '#'
  },
  {
    _id: '4',
    title: 'Modern Architecture Journal',
    publication: 'Modern Architecture Journal',
    projectName: 'Sustainable Urban Development',
    year: 2023,
    type: 'Architecture feature',
    image: 'https://static.wixstatic.com/media/307f6c_24f5151f959e43d7aca3b33b5e9e8650~mv2.png?originWidth=576&originHeight=384',
    description: 'In-depth analysis of our sustainable urban development project, exploring green building practices and community-centered design.',
    externalLink: '#'
  },
  {
    _id: '5',
    title: 'Caribbean Design Feature',
    publication: 'Caribbean Design Quarterly',
    projectName: 'Tropical Resort Redesign',
    year: 2023,
    type: 'Featured project',
    image: 'https://static.wixstatic.com/media/307f6c_cb5b5a2f54c7405684c7e53838b29d6e~mv2.png?originWidth=576&originHeight=384',
    description: 'Comprehensive feature on our tropical resort redesign, celebrating the fusion of local culture with contemporary design aesthetics.',
    externalLink: '#'
  },
  {
    _id: '6',
    title: 'Custom Furniture Editorial',
    publication: 'Design Today',
    projectName: 'Artisan Furniture Series',
    year: 2022,
    type: 'Editorial mention',
    image: 'https://static.wixstatic.com/media/307f6c_52c543dfba7f44e2946974969703cbbf~mv2.png?originWidth=576&originHeight=384',
    description: 'Editorial spotlight on our artisan furniture series, highlighting the intersection of traditional craftsmanship and modern design.',
    externalLink: '#'
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await BaseCrudService.getAll<Services>('services');
      setServices(result.items || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <AnimatedElement>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-primary uppercase tracking-widest font-semibold text-sm mb-4">
                Our Services
              </p>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-secondary mb-6 leading-tight">
                Design Solutions
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Comprehensive design and construction solutions tailored to your vision
              </p>
            </motion.div>
          </AnimatedElement>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedElement className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Our Services
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-light">
              Comprehensive design and construction solutions tailored to your vision
            </p>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingServices ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : services.length > 0 ? (
              services.map((service, index) => (
                <AnimatedElement key={service._id} className={`${index % 2 === 0 ? 'delay-100' : 'delay-200'}`}>
                  <Link to={`/services/${service._id}`} className="group h-full">
                    <div className="h-full flex flex-col bg-white border border-border/20 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden bg-muted/50">
                        {service.serviceImage ? (
                          <Image 
                            src={service.serviceImage} 
                            alt={service.serviceName || 'Service'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/30" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-heading font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                            {service.serviceName}
                          </h3>
                          <p className="text-foreground/60 text-sm leading-relaxed line-clamp-3 font-light">
                            {service.shortDescription}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center text-primary text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                          Learn More <ArrowRight className="w-3 h-3 ml-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedElement>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                Services coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: '-100px' }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-foreground/80 mb-12 max-w-2xl mx-auto">
                Let's discuss your vision and bring it to life with our comprehensive design and construction solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                  onClick={() => navigate('/contact')}
                >
                  Get in Touch
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary/10"
                  onClick={() => navigate('/portfolio')}
                >
                  View Portfolio
                </Button>
              </div>
            </motion.div>
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}
