import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import img1 from "/purple.JPG";
import img2 from "/pink.JPG";
import img3 from "/blue.JPG";
import img4 from "/yellow.jpeg";
import img5 from "/beige.JPG";
import img6 from "/green.JPG";

function ColourModal({ onClose, onSelect }) {
    
    const colours = [
        { id: 1, name: "Ruby Red", hex: "#8E4DFF", image: img1 },
        { id: 2, name: "Ocean Blue", hex: "#005A73", image: img3 },
        { id: 3, name: "Forest Green", hex: "#34D98A", image: img6 },
        { id: 4, name: "Sunny Yellow", hex: "#F59E0B", image: img4 },
        { id: 5, name: "Lavender", hex: "#D955BB", image: img2 },
        { id: 6, name: "Charcoal", hex: "#B7A076", image: img5 },
    ];

    const [selectedColour, setSelectedColour] = useState(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop / Overlay */}
            <div 
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-6 border-b border-stone-100 bg-stone-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-stone-900">Choose Your Yarn</h2>
                            <p className="text-stone-500 text-sm mt-1">Select a colour for your handcrafted item.</p>
                        </div>
                        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto">
                    <span className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-4 block">
                        Available Colours
                    </span>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {colours.map((colour) => {
                            const isSelected = selectedColour && selectedColour.id === colour.id;
                            
                            return (
                                <button
                                    key={colour.id}
                                    onClick={() => setSelectedColour(colour)}
                                    className={`relative group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                        isSelected
                                            ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                                            : "border-stone-100 hover:border-stone-300 hover:bg-stone-50"
                                    }`}
                                >
                                    {/* Selection Badge */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1 shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Image & Hex Swatch */}
                                    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                                        <img
                                            src={colour.image}
                                            alt={colour.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Little color dot overlay */}
                                        <div 
                                            className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
                                            style={{ backgroundColor: colour.hex }}
                                        ></div>
                                    </div>

                                    <span className={`font-medium text-sm ${isSelected ? 'text-orange-900' : 'text-stone-700'}`}>
                                        {colour.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    
                    <p className="text-stone-400 text-xs italic mt-6 text-center">
                        * Note: Actual yarn colour may vary slightly due to lighting and screen settings.
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full text-stone-600 font-medium hover:bg-stone-200 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!selectedColour}
                        onClick={() => {
                            if (selectedColour) onSelect(selectedColour);
                        }}
                        className={`px-8 py-2.5 rounded-full font-bold shadow-lg transition-all transform active:scale-95 ${
                            selectedColour
                                ? "bg-stone-900 text-white hover:bg-orange-600 hover:shadow-orange-200"
                                : "bg-stone-200 text-stone-400 cursor-not-allowed"
                        }`}
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>,
        document.body 
    );
}

export default ColourModal;