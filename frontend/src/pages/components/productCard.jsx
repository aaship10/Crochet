import { useState } from "react";
import ColourModal from "./colourSelection";

function Card() {
  const [selectedColour, setSelectedColour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-60 hover:-translate-y-2 transition-transform">
      
      <div className="h-40 bg-gray-200 rounded-md mb-4"></div>

      <h2 className="text-lg font-bold mb-2">Product Name</h2>
      <p className="text-gray-600 mb-3">$29.99</p>

      {/* Choose colour link */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-2 mb-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition"
      >
        {selectedColour ? `Colour: ${selectedColour.name}` : "Choose Colour"}
      </button>

      {/* Small selected colour text */}
      {/* {selectedColour && (
        <p className="text-normal text-gray-600 mb-2">
          Selected colour:{" "}
          <span className="font-semibold">{selectedColour.name}</span>
        </p>
      )} */}

      {/* Add to Cart */}
      <button
        disabled={!selectedColour}
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
