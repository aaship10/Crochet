import { useState } from "react";

function Colour({onClose, onSelect}) {

    const colours = [
        {id:1, name:"Red", hex:"#FF0000"},
        {id:2, name:"Blue", hex:"#0000FF"},
        {id:3, name:"Green", hex:"#008000"},
        {id:4, name:"Yellow", hex:"#FFFF00"},
    ];

    const [selectedColour, setSelectedColour] = useState(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="bg-black rounded-2xl p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-white">
                    Select Colour
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {colours.map((colour) => (
                        <button 
                            key={colour.id}
                            onClick={() => setSelectedColour(colour)}
                            className="bg-gray-100 rounded-lg p-4 flex items-center justify-center ${selectedColour && selectedColour.id === colour.id ? 'border-4 border-purple-500' : ''}"
                        >
                            {/* <img
                                src={colour.image}
                                alt={colour.name}
                                className="object-cover rounded-lg" /> */}

                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colour.hex }}></div>
                            <span>{colour.name}</span>
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
                            onSelect(selectedColour);
                        }}
                        className="px-4 py-2 bg-purple-500 rounded-md hover:bg-purple-600 transition ml-2
                        ${
                            selectedColour ? 'bg-blue-200' : 'bg-blue-400 cursor-not-allowed'
                        }"
                    >
                        Confirm colour
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Colour;