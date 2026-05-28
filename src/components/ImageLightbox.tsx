import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  projectTitle?: string;
  mainImageIndex?: number;
}

export default function ImageLightbox({ images, projectTitle = 'Project', mainImageIndex = 0 }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(mainImageIndex);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (images.length === 0) return null;

  const open = () => { setCurrentIndex(mainImageIndex); setIsOpen(true); };
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(i => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(i => (i + 1) % images.length); };

  return (
    <>
      {/* ── Clickable thumbnail card ── */}
      <div
        onClick={open}
        className="relative h-80 overflow-hidden bg-muted cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl"
      >
        <img
          src={images[mainImageIndex]}
          alt={projectTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {images.length > 1 && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 text-secondary px-4 py-2 rounded-full text-sm font-semibold shadow">
              Ver {images.length} fotos
            </span>
          </div>
        )}
      </div>

      {/* ── Lightbox Modal ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
          onClick={() => setIsOpen(false)}
        >

          {/* Blurred background — fills black bars naturally */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(28px) brightness(0.25)',
              transform: 'scale(1.08)',
            }}
          />
          {/* Extra dark veil */}
          <div className="absolute inset-0 bg-black/40" />

          {/* ── Header ── */}
          <div
            className="relative z-10 flex-shrink-0 flex items-center justify-between px-5 py-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-white text-lg md:text-xl font-bold drop-shadow">{projectTitle}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Main image area — flex-1 so it fills all space between header and thumbnails ── */}
          <div
            className="relative z-10 flex-1 min-h-0 flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Counter */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/80 text-sm font-semibold bg-black/30 px-3 py-1 rounded-full pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>

            {/* The image — constrained so it never bleeds into header or thumbnails */}
            <img
              src={images[currentIndex]}
              alt={`${projectTitle} — foto ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
              style={{ maxHeight: 'calc(100vh - 180px)' }}
              draggable={false}
            />

            {/* Navigation arrows — only when multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 md:left-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/35 flex items-center justify-center text-white transition-all group"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 md:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/35 flex items-center justify-center text-white transition-all group"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* ── Thumbnail strip — flex-shrink-0 so it always sits at the bottom ── */}
          {images.length > 1 && (
            <div
              className="relative z-10 flex-shrink-0 flex justify-center gap-2 overflow-x-auto px-4 py-3"
              onClick={e => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={e => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`flex-shrink-0 h-14 w-14 md:h-16 md:w-16 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                    idx === currentIndex
                      ? 'border-primary opacity-100 scale-105 shadow-lg'
                      : 'border-white/20 opacity-45 hover:opacity-80 hover:border-white/50'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
