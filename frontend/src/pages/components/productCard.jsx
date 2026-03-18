import { useState } from "react";
import ColourModal from "./colourSelection";
import ProductCarousel from "./carouselPhotos";

function ProductCard({ product, onAddToCart }) {
  const [localSelectedColour, setLocalSelectedColour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddToCartClick = () => {
    if (localSelectedColour) {
      onAddToCart({ ...product, selectedColour: localSelectedColour });
    }
  };

  return (
    <div className="group relative w-full bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      
      <div className="aspect-square w-full bg-stone-50 relative overflow-hidden">
         <ProductCarousel product={product} />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                {product.name}
            </h2>
            <span className="text-lg font-bold text-orange-600">
                ₹{product.price}
            </span>
        </div>

        {/* <p className="text-sm text-stone-500 mb-4 line-clamp-2">
            {product.description}
        </p> */}

        <div className="mt-auto space-y-3">
            
            <button
                onClick={() => setShowModal(true)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    localSelectedColour 
                    ? "border-orange-200 bg-orange-50 text-orange-800" 
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                }`}
            >
                <span>{localSelectedColour ? `Color: ${localSelectedColour.name}` : "Select a Colour"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            <button
                disabled={!localSelectedColour}
                onClick={handleAddToCartClick}
                className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                localSelectedColour
                    ? "bg-stone-900 text-white hover:bg-orange-600 hover:shadow-orange-200"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {localSelectedColour ? "Add to Cart" : "Choose Option"}
            </button>
        </div>
      </div>

      {showModal && (
        <ColourModal
          onClose={() => setShowModal(false)}
          onSelect={(colour) => {
            setLocalSelectedColour(colour);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default ProductCard;