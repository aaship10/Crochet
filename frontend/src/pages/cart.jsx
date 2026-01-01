import Header from './components/header';
import Footer from './components/footer';

function Cart() {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow flex flex-col justify-center items-center p-8'>
                <h1 className='text-5xl font-extrabold mb-8'>Your Shopping Cart</h1>
                <p className='text-lg text-gray-700'>Your cart is currently empty. Start adding some crochet goodies!</p>
            </main>
            <Footer />
        </div>
    );
}

export default Cart;    