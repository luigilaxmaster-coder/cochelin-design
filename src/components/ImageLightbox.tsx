import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/* ─────────────────────────────────────────────
   LightboxModal  — standalone fullscreen modal
   Used by ProjectDetailPage and ImageLightbox
───────────────────────────────────────────── */
interface LightboxModalProps {
  images: string[];
  projectTitle?: string;
  startIndex?: number;
  onClose: () => void;
}

export function LightboxModal({
  images,
  projectTitle = '',
  startIndex = 0,
  onClose,
}: LightboxModalProps) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => { setIdx(startIndex); }, [startIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [images.length, onClose]);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" onClick={onClose}>
      {/* Blurred bg fills black bars with the image's own tones */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          backgroundImage: `url(${images[idx]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) brightness(0.22)',
          transform: 'scale(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* Header */}
      <div
        className="relative z-10 flex-shrink-0 flex items-center justify-between px-5 py-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-white text-base md:text-lg font-bold drop-shadow truncate max-w-[75%]">
          {projectTitle}
        </h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main image */}
      <div
        className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-14 md:px-20"
        onClick={e => e.stopPropagation()}
      >
        {/* Counter pill */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold bg-black/35 px-3 py-1 rounded-full pointer-events-none select-none">
          {idx + 1} / {images.length}
        </div>

        <img
          key={idx}
          src={images[idx]}
          alt={`${projectTitle} — foto ${idx + 1}`}
          className="max-w-full max-h-full object-contain drop-shadow-2xl select-none rounded-sm"
          style={{ maxHeight: 'calc(100vh - 190px)', animation: 'lbFadeIn 0.25s ease-out' }}
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Anterior"
              className="absolute left-2 md:left-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/35 flex items-center justify-center text-white transition-all duration-200 group">
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={next} aria-label="Siguiente"
              className="absolute right-2 md:right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/35 flex items-center justify-center text-white transition-all duration-200 group">
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="relative z-10 flex-shrink-0 flex justify-center gap-2 overflow-x-auto px-4 py-3"
          onClick={e => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIdx(i); }}
              aria-label={`Foto ${i + 1}`}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                i === idx
                  ? 'w-16 h-16 md:w-18 md:h-18 border-primary opacity-100 scale-105 shadow-lg'
                  : 'w-14 h-14 border-white/20 opacity-40 hover:opacity-75 hover:border-white/50'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* keyframe animation injected once */}
      <style>{`
        @keyframes lbFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ImageLightbox  — card thumbnail that opens
   LightboxModal on click (used in HomePage)
───────────────────────────────────────────── */
interface ImageLightboxProps {
  images: string[];
  projectTitle?: string;
  mainImageIndex?: number;
}

export default function ImageLightbox({
  images,
  projectTitle = 'Project',
  mainImageIndex = 0,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  if (images.length === 0) return null;

  return (
    <>
      {/* Clickable card image */}
      <div
        onClick={() => setOpen(true)}
        className="relative w-full aspect-[4/3] overflow-hidden bg-muted cursor-pointer group"
      >
        <img
          src={images[mainImageIndex]}
          alt={projectTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 text-secondary px-4 py-2 rounded-full text-sm font-semibold shadow-md">
              Ver {images.length} fotos
            </span>
          </div>
        )}
      </div>

      {open && (
        <LightboxModal
          images={images}
          projectTitle={projectTitle}
          startIndex={mainImageIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
