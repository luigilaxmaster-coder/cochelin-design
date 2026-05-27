// WI-HPI - Premium Homepage Redesign
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, MapPin, Phone, Mail, Instagram, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Services, ProjectPortfolio } from '@/entities';

// --- Safe Animation Component ---
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
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio');
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

  const nextProject = () => {
    if (projects.length === 0) return;
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    if (projects.length === 0) return;
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getVisibleProjects = () => {
    if (projects.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(4, projects.length); i++) {
      visible.push(projects[(currentProjectIndex + i) % projects.length]);
    }
    return visible;
  };

  const visibleProjects = getVisibleProjects();
  
  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const filteredProjects = selectedCategory 
    ? projects.filter(p => p.category === selectedCategory)
    : projects;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-paragraph text-foreground selection:bg-primary/30 selection:text-secondary">
      <Header />
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/307f6c_34a68d8af10a4967a6677783bdaf50de~mv2.png?originWidth=1600&originHeight=896" 
            alt="Luxury Interior Design Studio" 
            className="w-full h-full object-cover"
          />
          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center max-w-5xl">
          <FadeIn delay={100} direction="down">
            <p className="text-xs md:text-sm text-white/70 mb-6 uppercase tracking-[0.3em] font-medium">
              Premium Design Studio
            </p>
          </FadeIn>
          
          <FadeIn delay={300} direction="up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 leading-tight">
              Custom Architecture, Furniture & Interior Design
            </h1>
          </FadeIn>
          
          <FadeIn delay={500} direction="up">
            <p className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              Bespoke design, custom furniture, remodeling and turnkey project delivery for refined residential and commercial spaces.
            </p>
          </FadeIn>
          
          <FadeIn delay={700} direction="up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-secondary hover:bg-white hover:text-secondary rounded-none px-10 py-7 text-sm tracking-widest uppercase font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl"
              onClick={() => navigate('/contact')}
            >
              Start a Project
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-secondary rounded-none px-10 py-7 text-sm tracking-widest uppercase font-semibold transition-all duration-300"
              onClick={() => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Featured Projects
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeIn direction="up" className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-4">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingServices ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : services.length > 0 ? (
              services.map((service, index) => (
                <FadeIn key={service._id} delay={index * 100} direction="up">
                  <Link to={`/services/${service._id}`} className="group h-full">
                    <div className="h-full flex flex-col bg-white border border-border/30 hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-2xl">
                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden bg-muted">
                        {service.serviceImage ? (
                          <Image 
                            src={service.serviceImage} 
                            alt={service.serviceName || 'Service'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            <Sparkles className="w-8 h-8 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-heading font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                            {service.serviceName}
                          </h3>
                          <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                            {service.shortDescription}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center text-primary text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                          Explore <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                Services coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO SECTION ===== */}
      <section className="py-32 bg-muted/40 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeIn direction="up" className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-4">
              What We Do
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Interior Design', image: 'https://static.wixstatic.com/media/307f6c_a296e06da2a94749bf69322fa404b97e~mv2.png?originWidth=576&originHeight=384', delay: 0 },
              { title: 'Residential Furniture', image: 'https://static.wixstatic.com/media/307f6c_1f7e13b5f498423891adc7ad8f783c41~mv2.png?originWidth=576&originHeight=384', delay: 100 },
              { title: 'Commercial Furniture', image: 'https://static.wixstatic.com/media/307f6c_fb01f55513264bd9b7bcf45929d91409~mv2.png?originWidth=576&originHeight=384', delay: 200 },
              { title: 'Wine Cellars & Humidors', image: 'https://static.wixstatic.com/media/307f6c_2786f49002d84328a1a60b9784d32c4c~mv2.png?originWidth=576&originHeight=384', delay: 300 }
            ].map((item, index) => (
              <FadeIn key={index} delay={item.delay} direction="up">
                <div className="group relative h-80 md:h-96 overflow-hidden cursor-pointer">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white text-center tracking-wide group-hover:scale-110 transition-transform duration-500">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="text-white">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-8">
                  About Claire Cochelin
                </h2>
                <div className="w-16 h-1 bg-primary mb-8" />
                <p className="text-lg text-white/80 mb-8 leading-relaxed font-light">
                  Claire Cochelin is the visionary founder and CEO of CC Project Design. With over 15 years of expertise in architecture, interior design, and custom furniture creation, Claire has established herself as a leading designer in Santo Domingo.
                </p>
                <p className="text-lg text-white/80 mb-10 leading-relaxed font-light italic">
                  "Listening to what people desire, being creative and dedicated with all my expertise, always brings greater results than the original expectation."
                </p>
                <Button 
                  className="bg-primary text-secondary hover:bg-white hover:text-secondary rounded-none px-10 py-6 text-sm tracking-widest uppercase font-semibold transition-all duration-300"
                  onClick={() => navigate('/about')}
                >
                  Know More
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={200}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/15 translate-x-6 translate-y-6 -z-10" />
                <Image
                  src="https://static.wixstatic.com/media/307f6c_2b11b3f0935d456e8507ee0d27316bdb~mv2.png"
                  alt="Claire Cochelin, Founder & CEO"
                  className="w-full h-auto object-cover shadow-2xl"
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

      {/* ===== FEATURED PROJECTS SECTION ===== */}
      <section id="featured-projects" className="py-32 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeIn direction="up" className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-4">
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </FadeIn>

          {/* Category Filters */}
          {categories.length > 0 && (
            <FadeIn direction="up" delay={100} className="flex flex-wrap justify-center gap-3 mb-16">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-secondary text-white'
                    : 'border border-secondary text-secondary hover:bg-secondary/10'
                }`}
              >
                All Projects
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-secondary text-white'
                      : 'border border-secondary text-secondary hover:bg-secondary/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </FadeIn>
          )}

          {/* Projects Grid */}
          <div className="relative min-h-[400px]">
            {isLoadingProjects ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.slice(0, 8).map((project, index) => (
                  <FadeIn key={`${project._id}-${index}`} delay={index * 80} direction="up">
                    <Link to={`/projects/${project._id}`} className="group relative h-80 overflow-hidden block">
                      {project.mainImage ? (
                        <Image 
                          src={project.mainImage} 
                          alt={project.projectTitle || 'Project'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-primary/30" />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/80 transition-colors duration-500 flex flex-col justify-end p-6">
                        <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-white font-heading font-bold text-lg mb-1">{project.projectTitle}</h3>
                          <p className="text-primary text-xs uppercase tracking-wider">{project.category}</p>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                No projects in this category yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHY WORK WITH US SECTION ===== */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <FadeIn direction="up" className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4">
              Why Work With Us
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Custom-Made Design',
                description: 'Every project is uniquely tailored to your vision, preferences, and lifestyle.'
              },
              {
                title: 'Integrated Execution',
                description: 'From concept to completion, we manage every detail with precision and care.'
              },
              {
                title: 'Residential & Commercial Expertise',
                description: 'Proven experience across diverse project types and scales.'
              },
              {
                title: 'Turnkey Delivery',
                description: 'Complete project management ensuring seamless implementation and handover.'
              }
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeIn direction="up" className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-4">
              Our Process
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Consultation', icon: '💬' },
              { step: '02', title: 'Concept', icon: '✏️' },
              { step: '03', title: 'Design', icon: '🎨' },
              { step: '04', title: 'Fabrication', icon: '🔨' },
              { step: '05', title: 'Installation', icon: '📦' },
              { step: '06', title: 'Delivery', icon: '✓' }
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 80} direction="up">
                <div className="relative">
                  {/* Connector line */}
                  {index < 5 && (
                    <div className="hidden lg:block absolute top-12 -right-2 w-4 h-0.5 bg-primary/30" />
                  )}
                  
                  <div className="bg-white border border-border shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col items-center text-center group">
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{item.icon}</div>
                    <span className="text-3xl font-heading font-bold text-primary/30 mb-2">{item.step}</span>
                    <h3 className="text-sm font-heading font-bold text-secondary">{item.title}</h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="py-32 bg-muted relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white shadow-2xl flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 bg-secondary p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <FadeIn direction="right" className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-3">Book a Consultation</h2>
                <p className="text-primary/90 text-lg mb-10 font-light">Let's discuss your dream project</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Name</label>
                      <Input
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Email</label>
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
                      <label className="text-xs uppercase tracking-wider text-white/60">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        placeholder="(809) XXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Interest</label>
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
                    <label className="text-xs uppercase tracking-wider text-white/60">Message</label>
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
                    className="bg-primary text-secondary hover:bg-white hover:text-secondary rounded-none px-12 py-6 text-sm tracking-widest uppercase font-semibold transition-all duration-300 mt-6 w-full md:w-auto"
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
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-12">Get in Touch</h2>
                
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
