import Footer from './components/footer';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, Link } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

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
                if (!res.ok) throw new Error('Failed to fetch');
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

    const updateQuantity = async (itemId, currentQuantity, change) => {
        if (!token) return;

        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        const originalItems = [...cartItems];
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        try {
            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) throw new Error('Database update failed');
        } catch (err) {
            console.error('Error updating quantity:', err);
            setCartItems(originalItems); 
        }
    };

    const removeItem = async (itemId) => {
        if (!token) return;

        const originalItems = [...cartItems];
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

        try {
            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Database delete failed');
        } catch (err) {
            console.error('Error deleting item:', err);
            setCartItems(originalItems);
        }
    };

    const proceedToCheckout = () => {
        if (!token) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = subTotal > 100 ? 0 : 15; 
    const grandTotal = subTotal + shippingCost;

    return (
        <div className='flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800'>
            <main className='flex-grow container mx-auto px-4 py-12'>
                
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Shopping Cart</h1>

                {isLoading ? (
                    <div className="text-center py-20 text-stone-500">Loading your cozy items...</div>
                ) : cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-4xl">
                            🛒
                        </div>
                        <h2 className='text-2xl font-serif font-bold mb-2'>Your cart is empty</h2>
                        <p className='text-stone-500 mb-8 max-w-md text-center'>
                            Looks like you haven't added any handmade treasures yet.
                        </p>
                        <Link to="/product" className='bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg'>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className='flex flex-col lg:flex-row gap-8 items-start'>
                        
                        <div className='w-full lg:w-2/3 space-y-4'>
                            {cartItems.map((item) => (
                                <div key={item.id} className='bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md'>
                                    
                                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-stone-100 rounded-xl overflow-hidden">
                                        {item.image ? (
                                            <img 
                                                src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                                                alt={item.product_name} 
                                                className='w-full h-full object-cover' 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                                        )}
                                    </div>

                                    <div className='flex-grow flex flex-col justify-between'>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className='text-xl font-serif font-bold text-stone-900'>{item.product_name}</h3>
                                                <p className='text-lg font-bold text-orange-600'>${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className='text-stone-500 text-sm mt-1'>
                                                {item.colour ? `Colour: ${item.colour}` : 'Standard'}
                                                <span className="mx-2">•</span> 
                                                Unit Price: ${item.price}
                                            </p>
                                        </div>

                                        <div className='flex justify-between items-end mt-4'>
                                            
                                            <div className='flex items-center border border-stone-200 rounded-full bg-stone-50'>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity, -1)} 
                                                    disabled={item.quantity <= 1}
                                                    className='w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors disabled:opacity-30'
                                                >
                                                    -
                                                </button>
                                                <span className='w-8 text-center font-bold text-stone-800'>{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity, 1)} 
                                                    className='w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors'
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => removeItem(item.id)} 
                                                className='text-stone-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1 group'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                                Remove
                                            </button>
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
                                        <span>${subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600">
                                        <span>Shipping Estimate</span>
                                        <span>{shippingCost === 0 ? <span className="text-green-600 font-bold">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                                    </div>
                                    <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-stone-900">Total</span>
                                        <span className="text-2xl font-bold text-stone-900">${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={proceedToCheckout} 
                                    className='w-full bg-stone-900 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-stone-200'
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <div className="mt-6 text-center">
                                     {/* <p className="text-xs text-stone-400">Secure Checkout powered by Stripe</p> */}
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