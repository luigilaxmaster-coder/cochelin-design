// WI-HPI
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, MapPin, Phone, Mail, Instagram } from 'lucide-react';
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
// Ensures ref is always attached to a rendered DOM element to prevent hydration/intersection observer crashes.
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

// --- Reusable Section Heading ---
const SectionHeading: React.FC<{ topText: string; bottomText: string; light?: boolean }> = ({ topText, bottomText, light = false }) => (
  <div className="text-center mb-16">
    <FadeIn direction="up">
      <span className={`block text-3xl md:text-4xl italic mb-2 ${light ? 'text-primary/80' : 'text-primary'}`} style={{ fontFamily: 'cursive' }}>
        {topText}
      </span>
      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-widest ${light ? 'text-white' : 'text-secondary'}`}>
        {bottomText}
      </h2>
    </FadeIn>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [projects, setProjects] = useState<ProjectPortfolio[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Calculate visible projects for carousel safely
  const getVisibleProjects = () => {
    if (projects.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(4, projects.length); i++) {
      visible.push(projects[(currentProjectIndex + i) % projects.length]);
    }
    return visible;
  };

  const visibleProjects = getVisibleProjects();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-paragraph text-foreground selection:bg-primary/30 selection:text-secondary">
      <Header />
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax feel */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/307f6c_34a68d8af10a4967a6677783bdaf50de~mv2.png?originWidth=1600&originHeight=896" 
            alt="Luxury Interior Design" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/40 via-black/60 to-background/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mt-20">
          <FadeIn delay={100} direction="down">
            <p className="text-xs md:text-sm text-white/80 mb-6 uppercase tracking-[0.3em] font-medium">
              Architecture, Furniture, Design and Construction
            </p>
          </FadeIn>
          
          <FadeIn delay={300} direction="up">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold text-primary mb-8">
              Custom made
            </h1>
          </FadeIn>
          
          <FadeIn delay={500} direction="up" className="max-w-3xl mx-auto">
            <blockquote className="text-lg md:text-xl lg:text-2xl text-white/90 italic mb-6 leading-relaxed font-light">
              &quot;Listening to what people desire, being creative and dedicated with all my expertise, always brings greater results than the original expectation.&quot;
            </blockquote>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-12">
              - Claire Cochelin
            </p>
          </FadeIn>
          
          <FadeIn delay={700} direction="up">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-white hover:text-secondary rounded-none px-12 py-6 text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(191,173,155,0.4)]"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </FadeIn>
        </div>
      </section>
      {/* SERVICES SECTION */}
      <section className="py-24 bg-background relative">
        {/* Decorative background band matching screenshot */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-primary/10 -z-10" />
        
        <div className="container mx-auto px-4">
          <SectionHeading topText="Our" bottomText="Services" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
            {isLoadingServices ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : services.length > 0 ? (
              services.map((service, index) => (
                <FadeIn key={service._id} delay={index * 150} direction="up" className="h-full">
                  <Link to={`/services/${service._id}`} className="block h-full group">
                    <div className="h-full flex flex-col bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 relative overflow-hidden">
                      {/* Hover accent line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-20" />
                      
                      <div className="relative h-64 overflow-hidden">
                        {service.serviceImage ? (
                          <Image 
                            src={service.serviceImage} 
                            alt={service.serviceName || 'Service'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col justify-between bg-white relative z-10">
                        <div>
                          <h3 className="text-xl font-heading font-bold text-secondary mb-4 group-hover:text-primary transition-colors">
                            {service.serviceName}
                          </h3>
                          <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
                            {service.shortDescription}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center text-primary text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                          Learn More <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No services available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* WHAT WE DO SECTION */}
      <section className="py-24 bg-muted/30 relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-primary/10 -z-10" />
        
        <div className="container mx-auto px-4">
          <SectionHeading topText="What" bottomText="We do" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {[
              { title: 'INTERIOR DESIGN', image: 'https://static.wixstatic.com/media/307f6c_a296e06da2a94749bf69322fa404b97e~mv2.png?originWidth=576&originHeight=384', delay: 0 },
              { title: 'RESIDENTIAL FURNITURE', image: 'https://static.wixstatic.com/media/307f6c_1f7e13b5f498423891adc7ad8f783c41~mv2.png?originWidth=576&originHeight=384', delay: 100 },
              { title: 'COMMERCIAL FURNITURE', image: 'https://static.wixstatic.com/media/307f6c_fb01f55513264bd9b7bcf45929d91409~mv2.png?originWidth=576&originHeight=384', delay: 200 },
              { title: 'WINE CELLARS AND HUMIDORS', image: 'https://static.wixstatic.com/media/307f6c_2786f49002d84328a1a60b9784d32c4c~mv2.png?originWidth=576&originHeight=384', delay: 300 }
            ].map((item, index) => (
              <FadeIn key={index} delay={item.delay} direction="up">
                <div className="group relative h-[300px] md:h-[400px] overflow-hidden cursor-pointer">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                  
                  {/* Decorative border that appears on hover */}
                  <div className="absolute inset-4 border border-white/0 group-hover:border-white/30 transition-colors duration-500 z-10" />
                  
                  <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white text-center tracking-widest uppercase drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ABOUT US SECTION */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary-foreground/5 -skew-x-12 translate-x-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <FadeIn direction="right">
              <div className="text-white">
                <span className="block text-3xl md:text-4xl italic mb-2 text-primary" style={{ fontFamily: 'cursive' }}>
                  About
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-widest mb-8">
                  Us
                </h2>
                
                <div className="w-12 h-1 bg-primary mb-8" />
                
                <p className="text-lg text-white/80 mb-8 leading-relaxed font-light">
                  Hello! I&apos;m Claire Cochelin, the CEO and Interior Designer at CC Project Design. I&apos;d like to invite you to explore a little bit more about my career, our work and lines of projects.
                </p>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-white hover:text-secondary rounded-none px-10 py-6 text-sm tracking-widest uppercase transition-all duration-300"
                  onClick={() => navigate('/about')}
                >
                  Know more
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={200}>
              <div className="relative px-4 md:px-12 py-8">
                {/* Offset background square matching screenshot style */}
                <div className="absolute inset-0 bg-primary/20 translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 -z-10" />
                <div className="relative shadow-2xl">
                  <Image
                    src="https://static.wixstatic.com/media/307f6c_2b11b3f0935d456e8507ee0d27316bdb~mv2.png"
                    className="w-full h-auto object-cover aspect-[4/5]"
                    originWidth={1086}
                    originHeight={1448}
                    focalPointX={42.21915285451197}
                    focalPointY={20.33839779005525} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      {/* FEATURED PROJECTS SECTION */}
      <section className="py-24 bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-primary/10 -z-10" />
        
        <div className="container mx-auto px-4">
          <SectionHeading topText="Featured" bottomText="Projects" />

          <div className="relative min-h-[400px] max-w-7xl mx-auto">
            {isLoadingProjects ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : projects.length > 0 ? (
              <div className="relative group/carousel">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {visibleProjects.map((project, index) => (
                    <FadeIn key={`${project._id}-${index}`} delay={index * 100} direction="up">
                      <Link to={`/projects/${project._id}`} className="block group relative h-[350px] overflow-hidden cursor-pointer">
                        {project.mainImage ? (
                          <Image 
                            src={project.mainImage} 
                            alt={project.projectTitle || 'Project'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                          <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white font-heading font-bold text-xl mb-1">{project.projectTitle}</h3>
                            <p className="text-primary text-sm uppercase tracking-wider">{project.category}</p>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>

                {/* Carousel Controls */}
                {projects.length > 4 && (
                  <>
                    <button
                      onClick={prevProject}
                      className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 bg-white text-secondary rounded-full p-4 shadow-xl hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0"
                      aria-label="Previous project"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextProject}
                      className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 bg-white text-secondary rounded-full p-4 shadow-xl hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0"
                      aria-label="Next project"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                No projects available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* CONTACT SECTION */}
      <section className="py-24 bg-muted relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white shadow-2xl flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Side - Form (Dark Teal) */}
            <div className="w-full lg:w-1/2 bg-secondary p-10 md:p-16 text-white relative overflow-hidden">
              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <FadeIn direction="right" className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Let&apos;s talk</h2>
                <p className="text-primary/90 text-lg mb-8 font-light">about your dream project</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Name</label>
                      <Input
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Last name</label>
                      <Input
                        className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Email</label>
                      <Input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/60">Phone number</label>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">What are you looking for?</label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white focus:ring-0 focus:border-primary transition-colors">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-secondary border-none rounded-none">
                        <SelectItem value="wine-cellars">Wine cellars and Humidors</SelectItem>
                        <SelectItem value="commercial">Commercial furniture</SelectItem>
                        <SelectItem value="interior">Interior design</SelectItem>
                        <SelectItem value="residential">Residential Furniture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">Message</label>
                    <Textarea
                      value={formData.inquiryMessage}
                      onChange={(e) => setFormData({ ...formData, inquiryMessage: e.target.value })}
                      required
                      rows={3}
                      className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-white hover:text-secondary rounded-none px-10 py-6 text-sm tracking-widest uppercase transition-all duration-300 mt-4"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Send Message
                  </Button>
                </form>
              </FadeIn>
            </div>

            {/* Right Side - Info (White) */}
            <div className="w-full lg:w-1/2 bg-white p-10 md:p-16 flex flex-col justify-center">
              <FadeIn direction="left" delay={200}>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-12">Contact us</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-secondary font-medium text-lg">(809) 539 - 4575</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-secondary font-medium text-lg">projectdesign2@hotmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-secondary font-medium text-lg">Santo Domingo, Dominican Republic</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 uppercase tracking-wider mb-1">Social</p>
                      <p className="text-secondary font-medium text-lg">@ccprojectdesign</p>
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