import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const EmblaCarousel = ({
  images = [],
  w = "160px",
  h = "160px",
  autoplayDelay = 3000,
  autoplayEnabled = false,
  onImageClick = null,
  activeIndex = null,
  showDots = false,
}) => {
  // ⚙️ Autoplay plugin
  const autoplay = Autoplay(
    { delay: autoplayDelay, stopOnInteraction: false },
    (emblaRoot) => emblaRoot.parentElement
  );

  // ⚙️ Embla với options để hiển thị 3 ảnh
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    autoplayEnabled ? [autoplay] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  // --- Khởi tạo các event của Embla ---
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // --- Điều hướng ---
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (idx) => emblaApi && emblaApi.scrollTo(idx),
    [emblaApi]
  );

  // --- Hover để tạm dừng autoplay ---
  const handleMouseEnter = () => {
    if (!autoplayEnabled || !autoplay?.stop) return;
    autoplay.stop();
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8 text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <section
      className="embla relative w-full group"
      onMouseEnter={handleMouseEnter}
    >
      {/* Viewport */}
      <div
        className="embla__viewport overflow-hidden rounded-lg"
        ref={emblaRef}
      >
        <div className="embla__container flex -ml-3">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="embla__slide flex-shrink-0 pl-3 min-w-0"
              style={{ flexBasis: `calc(33.333% - 12px)` }}
              onClick={(e) => onImageClick && onImageClick(e, src)}
            >
              <div
                className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                  onImageClick ? "cursor-pointer" : ""
                } ${
                  activeIndex === idx
                    ? "ring-2 ring-blue-500 shadow-lg scale-105"
                    : "ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md"
                }`}
                style={{ width: "100%", height: h }}
              >
                <img
                  src={src.image_url || src}
                  alt={`slide_${idx}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />

                {/* Active indicator overlay */}
                {activeIndex === idx && (
                  <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 0 && (
        <>
          <button
            className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 
          bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg 
            border border-gray-200 transition-all duration-300
            hover:scale-110 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          <button
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 
          bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg 
            border border-gray-200 transition-all duration-300
            hover:scale-110 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next slide"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && scrollSnaps.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === selectedIndex
                  ? "w-8 h-2 bg-blue-600"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default EmblaCarousel;
