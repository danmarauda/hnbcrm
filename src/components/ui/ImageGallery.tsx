import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Image {
  url: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: Image[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <div className={cn("flex flex-col gap-4", className)}>
        {/* Main image */}
        <div
          className="relative aspect-video rounded-lg overflow-hidden glass border border-glass-border cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[current].url}
            alt={images[current].caption || `Image ${current + 1}`}
            className="w-full h-full object-cover"
          />
          {images[current].caption && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-sm text-white/90">{images[current].caption}</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                  idx === current ? "border-white/30" : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <img src={img.url} alt={img.caption || `Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrent((current - 1 + images.length) % images.length); }}
                  className="absolute left-4 z-10 p-3 rounded-full glass hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrent((current + 1) % images.length); }}
                  className="absolute right-4 z-10 p-3 rounded-full glass hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={images[current].url}
              alt={images[current].caption || `Image ${current + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            {images[current].caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <p className="text-sm text-white/70 px-4 py-2 glass rounded-full">
                  {images[current].caption}
                </p>
              </div>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      idx === current ? "bg-white w-4" : "bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
