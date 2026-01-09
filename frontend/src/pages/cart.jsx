import Footer from './components/footer';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    // 1. Fetch Initial Cart Data
    useEffect(() => {
        const fetchCartData = async () => {
            if (!token) {
                setCartItems([]);
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/cart', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 401) {
                    alert('Please login to view your cart.');
                    navigate('/login');
                    return;
                }
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setCartItems(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCartData();
    }, [token, navigate]);

    // 2. Handle Quantity Update (PUT Request)
    const updateQuantity = async (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        // A. Optimistic Update (Update UI immediately)
        const originalItems = [...cartItems]; // Backup state in case of error
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        // B. Database Update
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.status === 401) {
                alert('Please login to update cart items');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Database update failed');
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
            // Revert UI if DB update fails
            setCartItems(originalItems);
            alert("Could not update quantity. Please try again.");
        }
    };

    // 3. Handle Remove Item (DELETE Request)
    const removeItem = async (itemId) => {
        // A. Optimistic Update
        const originalItems = [...cartItems];
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

        // B. Database Update
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                alert('Please login to remove cart items');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Database delete failed');
            }
        } catch (err) {
            console.error('Error deleting item:', err);
            // Revert UI if DB delete fails
            setCartItems(originalItems);
            alert("Could not delete item. Please try again.");
        }
    };

    const handlePayment = () => {
        alert("Redirecting to payment...");
        // navigate('/checkout');
    };

    const grandTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow flex flex-col justify-center items-center p-8'>
                {cartItems.length === 0 ? (
                    <p className='text-lg text-gray-700'>Your cart is currently empty.</p>
                ) : (
                    <div className='flex flex-col justify-start bg-indigo-100 w-full max-w-4xl p-8 rounded-lg shadow-md'>
                        <h2 className='text-2xl font-bold mb-6 text-indigo-900'>Your Cart</h2>
                        <ul className='space-y-4'>
                            {cartItems.map((item) => (
                                <li key={item.id} className='bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4'>
                                    {/* Product Info */}
                                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                                        {item.image && <img src={item.image} alt={item.product_name} className='h-20 w-20 object-cover rounded-md border' />}
                                        <div className='flex flex-col'>
                                            <span className='text-lg font-bold text-gray-800'>{item.product_name}</span>
                                            <span className='text-sm text-gray-500'>{item.colour ? `Colour: ${item.colour}` : ''}</span>
                                            <span className='text-indigo-600 font-medium'>${item.price}</span>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className='flex items-center gap-6'>
                                        <div className='flex items-center bg-gray-100 rounded-lg'>
                                            <button onClick={() => updateQuantity(item.id, item.quantity, -1)} className='px-3 py-1 hover:bg-gray-200 rounded-l-lg' disabled={item.quantity <= 1}>-</button>
                                            <span className='px-3 font-semibold'>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity, 1)} className='px-3 py-1 hover:bg-gray-200 rounded-r-lg'>+</button>
                                        </div>
                                        <div className='font-semibold text-gray-700 w-20 text-right'>${(item.price * item.quantity).toFixed(2)}</div>
                                        <button onClick={() => removeItem(item.id)} className='text-red-500 hover:bg-red-50 p-2 rounded-full'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='mt-8 pt-6 border-t border-indigo-200 flex flex-col items-end gap-4'>
                            <div className='flex items-center gap-4'>
                                <span className='text-xl font-bold text-gray-700'>Grand Total:</span>
                                <span className='text-3xl font-extrabold text-indigo-700'>${grandTotal.toFixed(2)}</span>
                            </div>
                            <button onClick={handlePayment} className='bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-lg'>
                                Proceed to Payment →
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Cart;