import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img2 from '/p1-2.jpeg';
import img3 from '/p1-3.jpeg';
import img4 from '/p1-4.jpeg';

const ProductCarousel = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  console.log(product.images);
  const slides = [
    product.images?.[0] || product.image_url,
    product.images?.[1] || img2,
    product.images?.[2] || img3,
    product.images?.[3] || img4,
  ].filter(Boolean); 

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  if (!slides.length) return null;

  return (
    <div
      className="w-full h-full relative group rounded-md overflow-hidden z-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Stack */}
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{ backgroundImage: `url(${slide})` }}
          className={`absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gray-100 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        />
      ))}

      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="hidden group-hover:block absolute top-[50%] -translate-y-[50%] left-1 z-10 rounded-full p-1 bg-white/80 text-gray-800 hover:bg-white transition-colors shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="hidden group-hover:block absolute top-[50%] -translate-y-[50%] right-1 z-10 rounded-full p-1 bg-white/80 text-gray-800 hover:bg-white transition-colors shadow-sm"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              currentIndex === index ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
