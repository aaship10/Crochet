import { useState } from "react";
import { createPortal } from "react-dom"; 
import img1 from "../../../public/p1-1.jpeg";

function Colour({ onClose, onSelect }) {
    const colours = [
        { id: 1, name: "Red", hex: "#FF0000", image: img1 },
        { id: 2, name: "Blue", hex: "#0000FF", image: img1 },
        { id: 3, name: "Green", hex: "#008000", image: img1 },
        { id: 4, name: "Yellow", hex: "#FFFF00", image: img1 },
    ];

    const [selectedColour, setSelectedColour] = useState(null);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative z-10 bg-black rounded-2xl p-6 overflow-y-auto max-h-[90vh] w-96">
                <h2 className="text-2xl font-bold text-white">Select Colour</h2>
                <span className="text-white text-sm font-normal mb-4 block">
                    (Colour may vary a little from the photograph)
                </span>
                
                <div className="grid grid-cols-1 gap-4">
                    {colours.map((colour) => (
                        <button
                            key={colour.id}
                            onClick={() => setSelectedColour(colour)}
                            className={`bg-gray-100 rounded-lg p-4 flex items-center justify-between transition-all ${
                                selectedColour && selectedColour.id === colour.id
                                    ? "border-4 border-purple-500 ring-2 ring-purple-300"
                                    : "border-transparent"
                            }`}
                        >
                            <span className="font-semibold">{colour.name}</span>
                            <img
                                src={colour.image}
                                alt={colour.name}
                                className="object-cover rounded-lg w-20 h-20"
                            />
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    >
                        Close
                    </button>

                    <button
                        disabled={!selectedColour}
                        onClick={() => {
                            if (selectedColour) onSelect(selectedColour);
                        }}
                        className={`px-4 py-2 rounded-md transition ml-2 ${
                            selectedColour
                                ? "bg-purple-500 hover:bg-purple-600 text-white"
                                : "bg-blue-400 cursor-not-allowed text-gray-200"
                        }`}
                    >
                        Confirm colour
                    </button>
                </div>
            </div>
        </div>,
        document.body 
    );
}

export default Colour;