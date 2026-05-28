// Premium Homepage - Ultra Professional & Minimalist Design
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Phone, Mail, Instagram, ArrowRight, Check, ChevronLeft, ChevronRight, MessageSquare, Lightbulb, Pencil, Hammer, Wrench, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';
import PressCarousel, { PressItem } from '@/components/PressCarousel';
import { BaseCrudService } from '@/integrations';
import { Services, ProjectPortfolio } from '@/entities';

// --- Smooth Animation Component ---
const FadeIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}> = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate-y-0 translate-x-0 scale-100';
    switch (direction) {
      case 'up': return 'translate-y-12 scale-95';
      case 'down': return '-translate-y-12 scale-95';
      case 'left': return 'translate-x-12 scale-95';
      case 'right': return '-translate-x-12 scale-95';
      default: return 'scale-95';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [projects, setProjects] = useState<ProjectPortfolio[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    senderName: '',
    emailAddress: '',
    phoneNumber: '',
    subject: '',
    inquiryMessage: ''
  });

  useEffect(() => {
    loadServices();
    loadProjects();
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

  const loadProjects = async () => {
    try {
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio', undefined, { limit: 500 });
      setProjects(result.items || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await BaseCrudService.create('contactinquiries', {
        _id: crypto.randomUUID(),
        senderName: formData.senderName,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
        subject: formData.subject,
        inquiryMessage: formData.inquiryMessage,
        submissionDate: new Date().toISOString()
      });
      setFormData({
        senderName: '',
        emailAddress: '',
        phoneNumber: '',
        subject: '',
        inquiryMessage: ''
      });
      alert('Thank you! Your message has been sent successfully.');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define these variables first before using them in functions
  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const filteredProjects = selectedCategory 
    ? projects.filter(p => p.category === selectedCategory)
    : projects;

  const nextProject = () => {
    if (filteredProjects.length === 0) return;
    setCurrentProjectIndex((prev) => (prev + 3) % filteredProjects.length);
  };

  const prevProject = () => {
    if (filteredProjects.length === 0) return;
    setCurrentProjectIndex((prev) => {
      const newIndex = prev - 3;
      return newIndex < 0 ? Math.max(0, filteredProjects.length - 3) : newIndex;
    });
  };

  const getVisibleProjects = () => {
    if (filteredProjects.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(3, filteredProjects.length); i++) {
      visible.push(filteredProjects[(currentProjectIndex + i) % filteredProjects.length]);
    }
    return visible;
  };

  const visibleProjects = getVisibleProjects();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-paragraph text-foreground selection:bg-primary/30 selection:text-secondary">
      <Header />
      {/* ===== HERO SECTION - ULTRA MINIMALIST ===== */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Subtle Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7572-scaled.jpg"
            alt="CC Project Design - Interior Design Studio"
            className="w-full h-full object-cover"
          />
          {/* Refined Overlay - More Subtle */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
        </div>

        {/* Hero Content - Clean & Sophisticated */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center max-w-6xl">
          <FadeIn delay={100} direction="up">
            <p className="text-xs md:text-sm text-white/60 mb-8 uppercase tracking-[0.25em] font-light">
              Design Excellence
            </p>
          </FadeIn>
          
          <FadeIn delay={300} direction="up">
            <h1 className="text-6xl font-bold text-white mb-8 leading-tight tracking-tight font-pinyon-script lg:text-7xl md:text-7xl">Custom made</h1>
          </FadeIn>
          
          <FadeIn delay={500} direction="up">
            <p className="text-lg md:text-xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Custom furniture, interior design, and architectural solutions for refined residential and commercial spaces.
            </p>
          </FadeIn>
          
          <FadeIn delay={700} direction="up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-secondary hover:bg-primary/90 rounded-none px-12 py-6 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
              onClick={() => navigate('/contact')}
            >
              Start Your Project
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border border-white text-white hover:bg-white/10 rounded-none px-12 py-6 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
              onClick={() => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Portfolio
            </Button>
          </FadeIn>
        </div>
      </section>
      {/* ===== FEATURED PROJECTS SECTION - CAROUSEL ===== */}
      <section id="featured-projects" className="py-32 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeIn direction="up" className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Featured Projects
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-light">
              A selection of our most refined and innovative work
            </p>
          </FadeIn>

          {/* Category Filters */}
          {categories.length > 0 && (
            <FadeIn direction="up" delay={100} className="flex flex-wrap justify-center gap-3 mb-16">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentProjectIndex(0);
                }}
                className={`px-6 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
                  selectedCategory === null
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-secondary text-secondary hover:bg-secondary/5'
                }`}
              >
                All Projects
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentProjectIndex(0);
                  }}
                  className={`px-6 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
                    selectedCategory === cat
                      ? 'bg-secondary text-white border-secondary'
                      : 'border-secondary text-secondary hover:bg-secondary/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </FadeIn>
          )}

          {/* Projects Carousel */}
          <div className="relative">
            {isLoadingProjects ? (
              <div className="flex justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="relative">
                {/* Main Carousel Container */}
                <div className="relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {visibleProjects.map((project, index) => {
                      const projectImages = project.mainImage ? [project.mainImage] : [];
                      return (
                        <FadeIn key={`${project._id}-carousel-${index}`} delay={index * 100} direction="up">
                          {projectImages.length > 0 ? (
                            <div className="relative group rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                              <ImageLightbox
                                images={projectImages}
                                projectTitle={project.projectTitle || 'Proyecto'}
                                mainImageIndex={0}
                              />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 pointer-events-none">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                  <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-2">{project.category}</p>
                                  <h3 className="text-white font-heading font-bold text-2xl mb-3">{project.projectTitle}</h3>
                                  <p className="text-white/80 text-sm font-light line-clamp-2">{project.detailedDescription}</p>
                                  <div className="mt-4 flex items-center text-primary text-xs font-semibold uppercase tracking-wider">
                                    Hacer clic para ver fotos <ArrowRight className="w-3 h-3 ml-2" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-96 bg-muted flex items-center justify-center rounded-sm shadow-lg" />
                          )}
                        </FadeIn>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  {filteredProjects.length > 3 && (
                    <div className="flex items-center justify-between mt-12">
                      <div className="flex gap-4">
                        <button
                          onClick={prevProject}
                          className="w-12 h-12 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 flex items-center justify-center group"
                          aria-label="Previous projects"
                        >
                          <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={nextProject}
                          className="w-12 h-12 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 flex items-center justify-center group"
                          aria-label="Next projects"
                        >
                          <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>

                      {/* Carousel Indicators */}
                      <div className="flex gap-2">
                        {Array.from({ length: Math.ceil(filteredProjects.length / 3) }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentProjectIndex(idx * 3)}
                            className={`h-2 transition-all duration-300 rounded-full ${
                              idx === Math.floor(currentProjectIndex / 3)
                                ? 'bg-secondary w-8'
                                : 'bg-secondary/30 w-2 hover:bg-secondary/60'
                            }`}
                            aria-label={`Go to carousel page ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Project Counter */}
                      <div className="text-sm font-semibold text-secondary/60">
                        <span className="text-secondary">{currentProjectIndex + 1}</span>
                        {' - '}
                        <span className="text-secondary">{Math.min(currentProjectIndex + 3, filteredProjects.length)}</span>
                        {' of '}
                        <span>{filteredProjects.length}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-32 text-muted-foreground">
                No projects in this category yet.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* ===== EXPERTISE SECTION - ASYMMETRIC LAYOUT ===== */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Images */}
            <FadeIn direction="left" className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-80 overflow-hidden bg-muted">
                  <Image
                    src="https://static.wixstatic.com/media/307f6c_c35188f31df7483f8ea4a3dbb343cb84~mv2.png"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    originWidth={928}
                    originHeight={618}
                    focalPointX={45.66271551724138}
                    focalPointY={59.627831715210355} />
                </div>
                <div className="relative h-64 overflow-hidden bg-muted">
                  <Image
                    src="https://static.wixstatic.com/media/307f6c_7150912e67b34f7986cf0bddbb046515~mv2.jpg"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    originWidth={1707}
                    originHeight={2560} />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 overflow-hidden bg-muted">
                  <Image
                    src="https://static.wixstatic.com/media/307f6c_c674d698b62a4096a6b85762855f6c48~mv2.jpg"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    originWidth={1703}
                    originHeight={2560} />
                </div>
                <div className="relative h-80 overflow-hidden bg-muted">
                  <Image
                    src="https://static.wixstatic.com/media/307f6c_55a2b423af55449896c12b2b599fbedf~mv2.jpg"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    originWidth={1280}
                    originHeight={853} />
                </div>
              </div>
            </FadeIn>

            {/* Right - Content */}
            <FadeIn direction="right" delay={200} className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-4">Our Expertise</p>
                <h2 className="text-5xl md:text-6xl font-heading font-bold text-secondary mb-6 leading-tight">
                  Comprehensive Design Solutions
                </h2>
                <p className="text-foreground/70 text-lg leading-relaxed font-light">
                  From concept to completion, we deliver exceptional results across all design disciplines.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Interior Design', desc: 'Sophisticated spaces that reflect your lifestyle' },
                  { title: 'Custom Furniture', desc: 'Bespoke pieces crafted to perfection' },
                  { title: 'Architecture', desc: 'Innovative structural and design solutions' },
                  { title: 'Project Management', desc: 'Seamless execution from start to finish' }
                ].map((item, idx) => (
                  <FadeIn key={idx} delay={300 + idx * 100} direction="up">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-secondary mb-1">{item.title}</h3>
                        <p className="text-foreground/60 text-sm font-light">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      {/* ===== ABOUT SECTION - REFINED ===== */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-semibold mb-4">About the Founder</p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
                  Claire Cochelin
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed font-light">
                  Founder and CEO of CC Project Design, Claire brings over 15 years of expertise in architecture, interior design, and custom furniture creation. Her visionary approach has established her as a leading designer in Santo Domingo.
                </p>
                <p className="text-lg text-white/70 mb-10 leading-relaxed font-light italic border-l-2 border-primary pl-6">
                  "Listening to what people desire, being creative and dedicated with all my expertise, always brings greater results than the original expectation."
                </p>
                <Button 
                  className="bg-primary text-secondary hover:bg-white hover:text-secondary rounded-none px-10 py-6 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={200}>
              <div className="relative">
                <Image
                  src="https://static.wixstatic.com/media/307f6c_2b11b3f0935d456e8507ee0d27316bdb~mv2.png"
                  alt="Claire Cochelin, Founder & CEO"
                  className="w-full h-auto object-cover"
                  originWidth={1086}
                  originHeight={1448}
                  focalPointX={42.21915285451197}
                  focalPointY={20.33839779005525}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      {/* ===== FEATURED IN SECTION - PRESS & PUBLICATIONS ===== */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4 max-w-[120rem]">
          <FadeIn direction="up" className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Featured In
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-light">
              revista de republica dominicana de arquitectura
            </p>
          </FadeIn>

          {/* Press Carousel */}
          <FadeIn direction="up" delay={100}>
            <PressCarousel 
              items={[
                {
                  _id: '1',
                  title: 'Architecture Digest Feature',
                  publication: 'Architecture Digest',
                  projectName: 'Caribbean Luxury Residence',
                  year: 2024,
                  type: 'Featured project',
                  image: 'https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7572-scaled.jpg',
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
                  image: 'https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7505-scaled.jpg',
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
                  image: 'https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7510-scaled.jpg',
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
                  image: 'https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7503-scaled.jpg',
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
                  image: 'https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7514-scaled.jpg',
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
                  image: 'https://ccprojectdesign.com/wp-content/uploads/2021/07/IMG_7517-scaled.jpg',
                  description: 'Editorial spotlight on our artisan furniture series, highlighting the intersection of traditional craftsmanship and modern design.',
                  externalLink: '#'
                }
              ]}
            />
          </FadeIn>

          {/* Explore Press Button */}
          <FadeIn direction="up" delay={200} className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-secondary text-white hover:bg-secondary/90 rounded-none px-12 py-6 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
              onClick={() => navigate('/services')}
            >
              Explore Our Press
            </Button>
          </FadeIn>
        </div>
      </section>
      {/* ===== WHY WORK WITH US SECTION ===== */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <FadeIn direction="up" className="text-center mb-24">
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-semibold mb-4">Why Choose Us</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6">
              Excellence in Every Detail
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto font-light">
              Our commitment to excellence and innovation sets us apart. We deliver more than designs—we create transformative experiences tailored to your vision.
            </p>
          </FadeIn>

          {/* Premium Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'Custom Design',
                description: 'Every project is uniquely tailored to your vision and lifestyle.',
                icon: Pencil,
                number: '01'
              },
              {
                title: 'Expert Execution',
                description: 'From concept to completion, we manage every detail with precision.',
                icon: Hammer,
                number: '02'
              },
              {
                title: 'Diverse Expertise',
                description: 'Proven experience across residential and commercial projects.',
                icon: Package,
                number: '03'
              },
              {
                title: 'Complete Solutions',
                description: 'Seamless project management and turnkey delivery.',
                icon: Wrench,
                number: '04'
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div className="group relative h-full overflow-hidden">
                  {/* Gradient background card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent border border-white/20 group-hover:border-primary/50 transition-all duration-500 rounded-lg" />
                  
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Number and Icon */}
                    <div className="flex items-start justify-between mb-8">
                      <span className="text-5xl font-heading font-bold text-white/15 group-hover:text-primary/30 transition-colors duration-300">
                        {item.number}
                      </span>
                      <div className="w-12 h-12 rounded-full bg-primary/20 group-hover:bg-primary/40 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                        <IconComponent className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed font-light flex-grow group-hover:text-white/80 transition-colors duration-300">
                      {item.description}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="mt-6 flex items-center text-primary text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transform transition-all duration-300">
                      <div className="w-1 h-1 rounded-full bg-primary mr-2" />
                      Learn More
                    </div>
                  </div>
                </div>
              </FadeIn>
            );})}
          </div>

          {/* Additional Benefits Section */}
          <FadeIn direction="up" delay={500} className="mt-20 pt-16 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  stat: '15+',
                  label: 'Years of Experience',
                  description: 'Proven track record in design excellence'
                },
                {
                  stat: '200+',
                  label: 'Projects Completed',
                  description: 'Residential and commercial masterpieces'
                },
                {
                  stat: '100%',
                  label: 'Client Satisfaction',
                  description: 'Dedicated to exceeding expectations'
                }
              ].map((item, idx) => (
                <FadeIn key={idx} delay={600 + idx * 100} direction="up">
                  <div className="text-center group">
                    <div className="text-5xl md:text-6xl font-heading font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                      {item.stat}
                    </div>
                    <h4 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {item.label}
                    </h4>
                    <p className="text-white/60 text-sm font-light">
                      {item.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
      {/* ===== PROCESS SECTION - DYNAMIC & AESTHETIC ===== */}
      <section className="py-32 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <FadeIn direction="up" className="text-center mb-20">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-4">Our Methodology</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Our Process
            </h2>
            <p className="text-foreground/60 text-lg max-w-3xl mx-auto font-light">
              A structured approach to delivering exceptional results. From initial consultation to final delivery, we guide you through every step with expertise and precision.
            </p>
          </FadeIn>

          {/* Process Steps - Enhanced Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              { 
                step: '01', 
                title: 'Consultation', 
                description: 'We listen to your vision, understand your needs, and explore possibilities for your project.',
                icon: MessageSquare
              },
              { 
                step: '02', 
                title: 'Concept', 
                description: 'Our team develops initial concepts and creative directions tailored to your requirements.',
                icon: Lightbulb
              },
              { 
                step: '03', 
                title: 'Design', 
                description: 'Detailed design development with technical drawings, materials selection, and refinements.',
                icon: Pencil
              },
              { 
                step: '04', 
                title: 'Fabrication', 
                description: 'Expert craftsmanship brings your design to life with precision and quality materials.',
                icon: Hammer
              },
              { 
                step: '05', 
                title: 'Installation', 
                description: 'Professional installation ensures perfect execution and seamless integration into your space.',
                icon: Wrench
              },
              { 
                step: '06', 
                title: 'Delivery', 
                description: 'Final touches and handover, ensuring complete satisfaction with your new space.',
                icon: Package
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <FadeIn key={index} delay={index * 80} direction="up">
                  <div className="group relative h-full">
                    {/* Card Background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-white/50 border border-border/40 group-hover:border-primary/60 transition-all duration-500 rounded-lg shadow-sm group-hover:shadow-xl" />
                    {/* Accent line on top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Content */}
                    <div className="relative p-8 h-full flex flex-col">
                      {/* Step Number */}
                      <div className="mb-6">
                        <span className="text-5xl font-heading font-bold text-primary/20 group-hover:text-primary/40 transition-colors duration-300">
                          {item.step}
                        </span>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:scale-110">
                        <IconComponent className="w-7 h-7 text-primary group-hover:text-primary transition-colors duration-300" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-heading font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-foreground/70 text-sm leading-relaxed font-light flex-grow group-hover:text-foreground/80 transition-colors duration-300">
                        {item.description}
                      </p>
                      
                      {/* Arrow indicator */}
                      <div className="mt-6 flex items-center text-primary text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transform transition-all duration-300">
                        <div className="w-1 h-1 rounded-full bg-primary mr-2" />
                        Next Step
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Timeline Visualization */}
          <FadeIn direction="up" delay={500} className="mt-20 pt-16 border-t border-border/20">
            <div className="relative">
              {/* Horizontal timeline line - visible on desktop */}
              <div className="hidden lg:block absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
              
              {/* Timeline dots and labels */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-8">
                {[
                  { number: '01', label: 'Consultation' },
                  { number: '02', label: 'Concept' },
                  { number: '03', label: 'Design' },
                  { number: '04', label: 'Fabrication' },
                  { number: '05', label: 'Installation' },
                  { number: '06', label: 'Delivery' }
                ].map((item, index) => (
                  <FadeIn key={index} delay={600 + index * 50} direction="up">
                    <div className="flex flex-col items-center group">
                      {/* Dot */}
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-primary/40 group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <span className="text-xs font-heading font-bold text-primary">{item.number}</span>
                      </div>
                      {/* Label */}
                      <p className="text-xs font-semibold text-secondary/60 group-hover:text-primary text-center transition-colors duration-300">
                        {item.label}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* CTA Section */}
          <FadeIn direction="up" delay={700} className="mt-20 text-center">
            <p className="text-foreground/70 text-lg mb-8 font-light">
              Ready to start your project? Let's discuss your vision and bring it to life.
            </p>
            <Button 
              size="lg" 
              className="bg-secondary text-white hover:bg-secondary/90 rounded-none px-12 py-6 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
              onClick={() => navigate('/contact')}
            >
              Begin Your Journey
            </Button>
          </FadeIn>
        </div>
      </section>
      {/* ===== CONTACT SECTION - REFINED ===== */}
      <section className="py-32 bg-muted relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white flex flex-col lg:flex-row overflow-hidden border border-border/30">
            
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 bg-secondary p-10 md:p-16 text-white relative overflow-hidden">
              <FadeIn direction="right" className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-3">Get Started</h2>
                <p className="text-primary/90 text-lg mb-10 font-light">Let's bring your vision to life</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Name</label>
                      <Input
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Email</label>
                      <Input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        placeholder="(809) XXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Interest</label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                        <SelectTrigger className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white focus:ring-0 focus:border-primary transition-colors">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary text-white border-none rounded-none">
                          <SelectItem value="wine-cellars">Wine Cellars & Humidors</SelectItem>
                          <SelectItem value="commercial">Commercial Furniture</SelectItem>
                          <SelectItem value="interior">Interior Design</SelectItem>
                          <SelectItem value="residential">Residential Furniture</SelectItem>
                          <SelectItem value="construction">Construction & Remodeling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Message</label>
                    <Textarea
                      value={formData.inquiryMessage}
                      onChange={(e) => setFormData({ ...formData, inquiryMessage: e.target.value })}
                      required
                      rows={4}
                      className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary text-secondary hover:bg-white hover:text-secondary rounded-none px-12 py-6 text-xs tracking-widest uppercase font-semibold transition-all duration-300 mt-6 w-full md:w-auto"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Send Message
                  </Button>
                </form>
              </FadeIn>
            </div>

            {/* Right Side - Info */}
            <div className="w-full lg:w-1/2 bg-white p-10 md:p-16 flex flex-col justify-center">
              <FadeIn direction="left" delay={200}>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-12">Contact Info</h2>
                
                <div className="space-y-10">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-semibold">Phone</p>
                      <a href="tel:+18095394575" className="text-secondary font-semibold text-lg hover:text-primary transition-colors">
                        (809) 539 - 4575
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-semibold">Email</p>
                      <a href="mailto:projectdesign2@hotmail.com" className="text-secondary font-semibold text-lg hover:text-primary transition-colors">
                        projectdesign2@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-semibold">Location</p>
                      <p className="text-secondary font-semibold text-lg">Santo Domingo, Dominican Republic</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-semibold">Instagram</p>
                      <a href="https://instagram.com/ccprojectdesign" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold text-lg hover:text-primary transition-colors">
                        @ccprojectdesign
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
