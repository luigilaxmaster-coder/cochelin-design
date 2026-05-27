import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Award, Users, Lightbulb, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/307f6c_371f7db58328493c9cc838ef5c93b590~mv2.png?originWidth=1152&originHeight=448)' }} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedElement>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              About <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
              Crafting exceptional spaces through innovative design and meticulous craftsmanship
            </p>
          </AnimatedElement>
        </div>
      </section>
      {/* CEO Introduction */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <AnimatedElement>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://static.wixstatic.com/media/307f6c_2b11b3f0935d456e8507ee0d27316bdb~mv2.png"
                    className="w-full h-auto"
                    width={600}
                    originWidth={1086}
                    originHeight={1448}
                    focalPointX={42.21915285451197}
                    focalPointY={20.33839779005525} />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
                  <p className="text-3xl font-bold">15+</p>
                  <p className="text-sm">Years Experience</p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement className="delay-200">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
                  Meet Claire Cochelin
                </h2>
                <p className="text-lg text-foreground mb-4">
                  Hello! I&apos;m Claire Cochelin, the CEO and Interior Designer at CC Project Design. With over 15 years of experience in architectural design and custom furniture manufacturing, I&apos;ve dedicated my career to transforming spaces into extraordinary environments.
                </p>
                <p className="text-lg text-foreground mb-6">
                  My philosophy is simple: listening to what people desire, being creative and dedicated with all my expertise, always brings greater results than the original expectation. Every project is an opportunity to exceed expectations and create something truly remarkable.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 italic text-foreground mb-6">
                  &quot;Listening to what people desire, being creative and dedicated with all my expertise, always brings greater results than the original expectation.&quot;
                </blockquote>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                  onClick={() => navigate('/contact')}
                >
                  Work With Us
                </Button>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>
      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">
                Our <span className="text-primary">Values</span>
              </h2>
              <p className="text-lg text-foreground max-w-2xl mx-auto">
                The principles that guide every project we undertake
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description: 'We strive for perfection in every detail, ensuring the highest quality in design and execution.'
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Working closely with clients to understand their vision and bring it to life.'
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                description: 'Pushing boundaries with creative solutions and cutting-edge design approaches.'
              },
              {
                icon: Target,
                title: 'Dedication',
                description: 'Committed to delivering results that exceed expectations on every project.'
              }
            ].map((value, index) => (
              <AnimatedElement key={index} className={`delay-${index * 100}`}>
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-secondary mb-3">{value.title}</h3>
                  <p className="text-foreground">{value.description}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* What We Do */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">
                What <span className="text-primary">We Do</span>
              </h2>
              <p className="text-lg text-foreground max-w-2xl mx-auto">
                Comprehensive solutions for all your design and construction needs
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Architectural Design',
                description: 'Design concept and consulting of architectural elements for construction and decoration.',
                image: 'https://static.wixstatic.com/media/307f6c_a34be9ec329c4c6298bc23a8e9a09cd5~mv2.png?originWidth=448&originHeight=320'
              },
              {
                title: 'Construction & Remodeling',
                description: 'Construction of new projects, remodeling, installation and turnkey delivery solutions.',
                image: 'https://static.wixstatic.com/media/307f6c_0dba1d57c60342f3b632291fa2963b29~mv2.png?originWidth=448&originHeight=320'
              },
              {
                title: 'Custom Furniture',
                description: 'Design and manufacture of furniture on custom-made measures for residential and commercial spaces.',
                image: 'https://static.wixstatic.com/media/307f6c_dfcec0d7993b4794b76502102048781e~mv2.png?originWidth=448&originHeight=320'
              }
            ].map((service, index) => (
              <AnimatedElement key={index} className={`delay-${index * 100}`}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={500}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-heading font-bold text-white mb-2">{service.title}</h3>
                    </div>
                  </div>
                  <div className="bg-card p-6">
                    <p className="text-foreground">{service.description}</p>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
                Let&apos;s Create Something Amazing Together
              </h2>
              <p className="text-lg text-foreground mb-8">
                Ready to transform your space? Get in touch with us today to discuss your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all hover:scale-105"
                  onClick={() => navigate('/portfolio')}
                >
                  View Portfolio
                </Button>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
      <Footer />
    </div>
  );
}
