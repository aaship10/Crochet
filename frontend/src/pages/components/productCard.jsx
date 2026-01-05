import { useState } from "react";
import ColourModal from "./colourSelection";
import ProductCarousel from "./carouselPhotos";

function Card({ product, onAddToCart, selectedColour, setSelectedColour }) {
  
  const [showModal, setShowModal] = useState(false);
  // const {name, price, colour} = product;
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-60 hover:-translate-y-2 transition-transform">
      
      <div className="h-40 w-full mb-4 relative rounded-md">
         <ProductCarousel 
          product = {product}
         />
      </div>

      <h2 className="text-lg font-bold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-3">${product.price}</p>

      {/* Choose colour link */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-2 mb-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition"
      >
        {selectedColour ? `Colour: ${selectedColour.name}` : "Choose Colour"}
      </button>

      {/* Add to Cart */}
      <button
        disabled={!selectedColour}
        onClick={onAddToCart}
        className={`w-full py-2 rounded-md text-white transition
          ${
            selectedColour
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gray-400 cursor-not-allowed"
          }
        `}
      >
        Add to Cart
      </button>

      {/* Colour modal */}
      {showModal && (
        <ColourModal
          onClose={() => setShowModal(false)}
          onSelect={(colour) => {
            setSelectedColour(colour);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Card;
