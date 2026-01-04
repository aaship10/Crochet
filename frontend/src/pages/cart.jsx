import Footer from './components/footer';
import { useEffect, useState } from 'react';
function Cart() {

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/cart')
        .then((res) => res.json())
        .then((data) => setCartItems(data))
        .catch((err) => console.error(err));
    },[]);

    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow flex flex-col justify-center items-center p-8'>
                <h1 className='text-5xl font-extrabold mb-8'>Your Shopping Cart</h1>
                {cartItems.length===0 ?
                <p className='text-lg text-gray-700'>Your cart is currently empty. Start adding some crochet goodies!</p> :
                (
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                {item.product_name} - ${item.price} x {item.quantity}
                            </li>    
                        ))}
                    </ul>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Cart;    