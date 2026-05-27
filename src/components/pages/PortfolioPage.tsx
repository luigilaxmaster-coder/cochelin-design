import { useState, useEffect, useRef } from 'react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await BaseCrudService.getAll<ProjectPortfolio>('projectportfolio');
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
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=1)' }} />
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
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              ))}
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            {isLoading ? null : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <AnimatedElement key={project._id} className={`delay-${(index % 6) * 100}`}>
                  <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-card cursor-pointer">
                    <div className="relative h-80 overflow-hidden">
                      {project.mainImage && (
                        <Image 
                          src={project.mainImage} 
                          alt={project.projectTitle || 'Project'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          width={600}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-heading font-bold text-white mb-2">
                          {project.projectTitle}
                        </h3>
                        {project.category && (
                          <p className="text-white/90 text-sm uppercase tracking-wider mb-2">{project.category}</p>
                        )}
                        {project.clientName && (
                          <p className="text-white/80 text-sm">Client: {project.clientName}</p>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-heading font-bold text-secondary mb-2">
                        {project.projectTitle}
                      </h3>
                      {project.detailedDescription && (
                        <p className="text-foreground text-sm line-clamp-2">{project.detailedDescription}</p>
                      )}
                    </div>
                  </div>
                </AnimatedElement>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-foreground text-lg">No projects found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">
                Project <span className="text-primary">Categories</span>
              </h2>
              <p className="text-lg text-foreground max-w-2xl mx-auto">
                From interior design to specialized wine cellars, we bring expertise to every project
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Interior Design', count: projects.filter(p => p.category?.toLowerCase().includes('interior')).length },
              { title: 'Residential Furniture', count: projects.filter(p => p.category?.toLowerCase().includes('residential')).length },
              { title: 'Commercial Furniture', count: projects.filter(p => p.category?.toLowerCase().includes('commercial')).length },
              { title: 'Wine Cellars', count: projects.filter(p => p.category?.toLowerCase().includes('wine')).length }
            ].map((cat, index) => (
              <AnimatedElement key={index} className={`delay-${index * 100}`}>
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-center">
                  <h3 className="text-xl font-heading font-bold text-secondary mb-2">{cat.title}</h3>
                  <p className="text-3xl font-bold text-primary">{cat.count}</p>
                  <p className="text-foreground text-sm">Projects</p>
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
