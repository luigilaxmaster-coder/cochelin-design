import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    emailAddress: '',
    phoneNumber: '',
    subject: '',
    inquiryMessage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=1)' }} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedElement>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
              Let&apos;s discuss your dream project and bring your vision to life
            </p>
          </AnimatedElement>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <AnimatedElement>
              <div className="bg-card rounded-3xl shadow-xl p-8 md:p-10">
                <h2 className="text-3xl font-heading font-bold text-secondary mb-6">
                  Send us a message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                    <Input
                      placeholder="Your name"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">What are you looking for? *</label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })} required>
                      <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interior-design">Interior Design</SelectItem>
                        <SelectItem value="residential-furniture">Residential Furniture</SelectItem>
                        <SelectItem value="commercial-furniture">Commercial Furniture</SelectItem>
                        <SelectItem value="wine-cellars">Wine Cellars and Humidors</SelectItem>
                        <SelectItem value="construction">Construction & Remodeling</SelectItem>
                        <SelectItem value="consultation">Design Consultation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea
                      placeholder="Tell us about your project..."
                      value={formData.inquiryMessage}
                      onChange={(e) => setFormData({ ...formData, inquiryMessage: e.target.value })}
                      required
                      rows={5}
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </AnimatedElement>

            {/* Contact Information */}
            <AnimatedElement className="delay-200">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-secondary mb-6">
                    Contact Information
                  </h2>
                  <p className="text-foreground mb-8">
                    Have questions? We&apos;re here to help. Reach out to us through any of the following channels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-secondary mb-1">Phone</h3>
                      <a href="tel:+18095394575" className="text-foreground hover:text-primary transition-colors">
                        (809) 539 - 4575
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-secondary mb-1">Email</h3>
                      <a href="mailto:projectdesign2@hotmail.com" className="text-foreground hover:text-primary transition-colors break-all">
                        projectdesign2@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-secondary mb-1">Location</h3>
                      <p className="text-foreground">Santo Domingo, Dominican Republic</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-secondary mb-1">Social Media</h3>
                      <a 
                        href="https://instagram.com/ccprojectdesign" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        @ccprojectdesign
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-secondary mb-1">Business Hours</h3>
                      <p className="text-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-foreground mb-8">
                Whether you&apos;re looking for custom furniture, interior design, or complete construction services, we&apos;re here to help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+18095394575">
                  <Button 
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    Call Us Now
                  </Button>
                </a>
                <a href="mailto:projectdesign2@hotmail.com">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all hover:scale-105"
                  >
                    Send Email
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}
