import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-heading font-bold text-primary">
                ccprojectdesign.com
              </span>
            </Link>
            <div className="space-y-1 text-sm">
              <p>ARCHITECTURE</p>
              <p>DECORATION</p>
              <p>CONSTRUCTION</p>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h3 className="font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors">
                  Wine cellars and Humidors
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors">
                  Commercial furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h3 className="font-heading font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors">
                  Residential Furniture
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors">
                  Interior design
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+18095394575" className="hover:text-primary transition-colors">
                  (809) 539 - 4575
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:projectdesign2@hotmail.com" className="hover:text-primary transition-colors">
                  projectdesign2@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Santo Domingo, Dominican Republic</span>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="https://instagram.com/ccprojectdesign" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @ccprojectdesign
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-foreground/20 pt-6 text-center text-sm">
          <p>© 2026 ccprojectdesign.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
