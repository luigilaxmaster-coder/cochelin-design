import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Image } from '@/components/ui/image';

interface ImageLightboxProps {
  images: string[];
  projectTitle?: string;
  mainImageIndex?: number;
}

export default function ImageLightbox({ images, projectTitle = 'Project', mainImageIndex = 0 }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(mainImageIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <>
      {/* Main Image - Clickable */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative h-80 overflow-hidden bg-muted rounded-2xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <Image
          src={images[mainImageIndex]}
          alt={projectTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          width={600}
        />
        {images.length > 1 && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
              Ver {images.length} fotos
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Header */}
          <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-6 md:px-12 z-10">
            <h2 className="text-white text-lg md:text-2xl font-bold">{projectTitle}</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Gallery Container */}
          <div
            className="w-full h-full flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Current Image */}
            <div className="w-full h-[70vh] md:h-[80vh] relative flex items-center justify-center">
              <Image
                src={images[currentIndex]}
                alt={`${projectTitle} - Photo ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Navigation - Left */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-all duration-300 text-white group z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-125 transition-transform" />
              </button>
            )}

            {/* Navigation - Right */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-all duration-300 text-white group z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-125 transition-transform" />
              </button>
            )}
          </div>

          {/* Footer with Indicators and Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4 z-10">
              {/* Image Counter */}
              <div className="text-white text-sm font-semibold">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto px-4 pb-2 max-w-4xl">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${
                      idx === currentIndex
                        ? 'border-primary scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
