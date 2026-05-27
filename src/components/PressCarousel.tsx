import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface PressItem {
  _id: string;
  title: string;
  publication: string;
  projectName: string;
  year: number;
  type: 'Featured project' | 'Editorial mention' | 'Published work' | 'Architecture feature';
  image: string;
  description: string;
  externalLink?: string;
}

interface PressCarouselProps {
  items: PressItem[];
  onItemClick?: (item: PressItem) => void;
}

export default function PressCarousel({ items, onItemClick }: PressCarouselProps) {
  const [selectedItem, setSelectedItem] = useState<PressItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout>();

  // Duplicate items for infinite loop effect
  const duplicatedItems = [...items, ...items, ...items];

  useEffect(() => {
    if (isPaused || items.length === 0) return;

    const startAnimation = () => {
      animationRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % (items.length * 3));
      }, 50);
    };

    startAnimation();
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isPaused, items.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + duplicatedItems.length) % duplicatedItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % duplicatedItems.length);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (items.length === 0) return null;

  // Calculate visible items based on screen size
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 1.2;
    if (width < 1024) return 3;
    return 4;
  };

  const visibleCount = getVisibleCount();
  const itemWidth = 100 / visibleCount;
  const offset = -currentIndex * itemWidth;

  return (
    <>
      <div
        ref={carouselRef}
        className="relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Carousel Container */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <motion.div
            className="flex h-full"
            animate={{ x: `${offset}%` }}
            transition={{
              type: 'tween',
              duration: 0.5,
              ease: 'linear',
            }}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="flex-shrink-0 px-3 md:px-4"
                style={{ width: `${itemWidth}%` }}
              >
                <motion.div
                  className="h-full cursor-pointer group"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setSelectedItem(item);
                    onItemClick?.(item);
                  }}
                >
                  {/* Card */}
                  <div className="relative h-full rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
                    {/* Image */}
                    <div className="relative h-3/4 overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={`${item.publication} - ${item.projectName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={400}
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="h-1/4 p-4 flex flex-col justify-between bg-white">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">
                          {item.type}
                        </p>
                        <h3 className="text-sm font-heading font-bold text-secondary line-clamp-2">
                          {item.publication}
                        </h3>
                      </div>
                      <p className="text-xs text-foreground/70">{item.year}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-secondary p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-secondary p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Pause indicator */}
          {isPaused && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-secondary/90 text-white px-3 py-1 rounded-full text-xs font-medium">
              Paused
            </div>
          )}
        </div>
      </div>

      {/* Modal/Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-muted transition-colors z-10"
                aria-label="Close"
              >
                <X size={24} className="text-secondary" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto md:min-h-[500px] overflow-hidden bg-muted">
                  <Image
                    src={selectedItem.image}
                    alt={`${selectedItem.publication} - ${selectedItem.projectName}`}
                    className="w-full h-full object-cover"
                    width={600}
                  />
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                      {selectedItem.type}
                    </p>
                    <h2 className="text-3xl font-heading font-bold text-secondary mb-2">
                      {selectedItem.publication}
                    </h2>
                    <p className="text-lg text-foreground/80 mb-4">
                      <span className="font-semibold">Project:</span> {selectedItem.projectName}
                    </p>
                    <p className="text-sm text-foreground/70 mb-6">
                      <span className="font-semibold">Year:</span> {selectedItem.year}
                    </p>
                    <p className="text-foreground leading-relaxed mb-8">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    {selectedItem.externalLink && (
                      <a
                        href={selectedItem.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Read Full Feature
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
                      onClick={() => setSelectedItem(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
