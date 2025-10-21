import { useRef, useState } from "react";

const ImageZoom = ({
  src,
  alt = "Product image",
  zoomLevel = 2.5,
  className = "",
}) => {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={{
        boxShadow: isZooming
          ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)"
          : "0 4px 6px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Overlay gradient khi hover */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: isZooming
            ? "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.02) 100%)"
            : "transparent",
          opacity: isZooming ? 1 : 0,
        }}
      />

      {/* Zoom icon indicator */}
      <div
        className="absolute top-4 right-4 z-20 pointer-events-none transition-all duration-300"
        style={{
          opacity: isZooming ? 0 : 1,
          transform: isZooming
            ? "scale(0.8) translateY(-4px)"
            : "scale(1) translateY(0)",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </div>
      </div>

      {/* Image container */}
      <div
        ref={imgRef}
        className="relative w-full h-full cursor-crosshair bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover select-none"
          draggable="false"
          style={{
            transform: isZooming ? `scale(${zoomLevel})` : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: isZooming ? "contrast(1.05) brightness(1.02)" : "none",
          }}
        />
      </div>

      {/* Border animation khi hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isZooming ? 1 : 0,
          boxShadow: "inset 0 0 0 2px rgba(59, 130, 246, 0.3)",
          borderRadius: "inherit",
        }}
      />
    </div>
  );
};

export default ImageZoom;
