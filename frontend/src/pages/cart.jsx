import Footer from './components/footer';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, Link } from 'react-router-dom';

function Cart({lati, longi}) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [distanceKm, setDistanceKm] = useState(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingError, setShippingError] = useState('');

    const [deliveryAddress, setDeliveryAddress] = useState('');
    const hasCalculatedRef = useRef(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    const STORE_COORDS = { lat: lati, lng: longi };

    // 1. Fetch Cart Data
    useEffect(() => {
        const fetchCartData = async () => {
            if (!token) {
                setCartItems([]);
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch('http://localhost:5000/api/cart', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 401) {
                    navigate('/login');
                    return;
                }
                const data = await res.json();
                setCartItems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCartData();
    }, [token, navigate]);

    // 2. Calculate Distance (UPDATED: Uses Live Geolocation)
    useEffect(() => {
        if (hasCalculatedRef.current || cartItems.length === 0) return;

        hasCalculatedRef.current = true;
        setIsCalculatingShipping(true);
        setShippingError('');

        const controller = new AbortController();

        const calculateDistance = async () => {
            try {
                // A. Get Current Live Coordinates
                const position = await new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error("Geolocation not supported"));
                    } else {
                        // Request high accuracy for better distance calc
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        });
                    }
                });

                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                setDeliveryAddress("Current Location"); 

                const routeRes = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${STORE_COORDS.lng},${STORE_COORDS.lat}?overview=false`,
                    { signal: controller.signal }
                );
                
                const routeData = await routeRes.json();

                if (routeData.code !== 'Ok') throw new Error('Route failed');

                const km = (routeData.routes[0].distance / 1000).toFixed(2);
                setDistanceKm(km);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Location Error:", err);
                    if (err.code === 1) {
                        setShippingError('Location permission denied');
                    } else {
                        setShippingError('Could not determine location');
                    }
                }
            } finally {
                setIsCalculatingShipping(false);
            }
        };

        calculateDistance();

        return () => controller.abort();
    }, [cartItems.length]); 

    const updateQuantity = async (itemId, currentQuantity, change) => {
        if (!token) return;
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        const originalItems = [...cartItems];
        setCartItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
        try {
            await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ quantity: newQuantity })
            });
        } catch (err) { setCartItems(originalItems); }
    };

    const removeItem = async (itemId) => {
        if (!token) return;
        const originalItems = [...cartItems];
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        try {
            await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) { setCartItems(originalItems); }
    };

    const proceedToCheckout = async () => {
        if (!token) return navigate('/login');

        if (distanceKm) {
            try {
                await fetch('http://localhost:5000/api/cart/distance', {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ distance: distanceKm })
                });
            } catch (err) {
                console.error("Failed to save distance:", err);
            }
        }
        navigate('/checkout');
    };

    const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const grandTotal = subTotal; 

    return (
        <div className='flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800'>
            <main className='flex-grow container mx-auto px-4 py-12'>
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Shopping Cart</h1>

                {isLoading ? (
                    <div className="text-center py-20 text-stone-500">Loading your cozy items...</div>
                ) : cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-4xl">🛒</div>
                        <h2 className='text-2xl font-serif font-bold mb-2'>Your cart is empty</h2>
                        <p className='text-stone-500 mb-8 max-w-md text-center'>Looks like you haven't added any handmade treasures yet.</p>
                        <Link to="/product" className='bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg'>Start Shopping</Link>
                    </div>
                ) : (
                    <div className='flex flex-col lg:flex-row gap-8 items-start'>
                        {/* LEFT COLUMN: ITEMS */}
                        <div className='w-full lg:w-2/3 space-y-4'>
                            {cartItems.map((item) => (
                                <div key={item.id} className='bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md'>
                                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-stone-100 rounded-xl overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.product_name} className='w-full h-full object-cover' />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                                        )}
                                    </div>
                                    <div className='flex-grow flex flex-col justify-between'>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className='text-xl font-serif font-bold text-stone-900'>{item.product_name}</h3>
                                                <p className='text-lg font-bold text-orange-600'>₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className='text-stone-500 text-sm mt-1'>
                                                {item.colour ? `Colour: ${item.colour}` : 'Standard'} <span className="mx-2">•</span> Unit Price: ₹{item.price}
                                            </p>
                                        </div>
                                        <div className='flex justify-between items-end mt-4'>
                                            <div className='flex items-center border border-stone-200 rounded-full bg-stone-50'>
                                                <button onClick={() => updateQuantity(item.id, item.quantity, -1)} disabled={item.quantity <= 1} className='w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors disabled:opacity-30'>-</button>
                                                <span className='w-8 text-center font-bold text-stone-800'>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity, 1)} className='w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors'>+</button>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className='text-stone-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1 group'>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='w-full lg:w-1/3'>
                            <div className='bg-white p-8 rounded-2xl shadow-lg border border-stone-100 sticky top-24'>
                                <h2 className='text-2xl font-serif font-bold text-stone-900 mb-6'>Order Summary</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-stone-600">
                                        <span>Subtotal</span>
                                        <span>₹{subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600">
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-1">
                                                Shipping
                                                {distanceKm && <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full">({distanceKm}km)</span>}
                                            </span>
                                            {shippingError && <span className="text-[10px] text-red-400">{shippingError}</span>}
                                        </div>
                                        <span>
                                            {isCalculatingShipping ? (
                                                <span className="text-xs text-orange-500 animate-pulse">Locating...</span>
                                            ) : shippingError ? (
                                                <span className="text-xs text-red-400">--</span>
                                            ) : (
                                                distanceKm ? (parseFloat(distanceKm) <= 5 ? "Free" : "Uber/PickUp") : "--"
                                            )}
                                        </span>
                                    </div>
                                    
                                    <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-stone-900">Total</span>
                                        <span className="text-2xl font-bold text-stone-900">
                                            {isCalculatingShipping ? '...' : `₹${grandTotal.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={proceedToCheckout} 
                                    disabled={isCalculatingShipping} 
                                    className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-colors
                                        ${isCalculatingShipping
                                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                                            : 'bg-stone-900 text-white hover:bg-orange-600'
                                        }`}
                                >
                                    {isCalculatingShipping 
                                        ? 'Locating You...' 
                                        : 'Proceed to Checkout'
                                    }
                                </button>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-xs text-stone-400">Secure Checkout powered by UPI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Cart;