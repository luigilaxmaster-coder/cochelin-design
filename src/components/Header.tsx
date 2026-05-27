import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="https://static.wixstatic.com/media/307f6c_c46a4793d21840d28ff9ac5d5d256299~mv2.png"
              alt="CC Project Design Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <Button
            className="hidden md:inline-flex bg-primary text-secondary hover:bg-primary/90 rounded-none px-6 py-2 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
            onClick={() => navigate('/contact')}
          >
            Book a Consultation
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              className="bg-primary text-secondary hover:bg-primary/90 rounded-none px-6 py-2 text-xs tracking-widest uppercase font-semibold transition-all duration-300 w-full mt-2"
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
            >
              Book a Consultation
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
