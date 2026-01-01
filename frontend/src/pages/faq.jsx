import Header from './components/header';
import Footer from './components/footer';

function Faq() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow'>
        <div className='flex flex-col justify-center items-center p-8 gap-8'>
          <h1 className='text-5xl font-extrabold'>Frequently Asked Questions</h1>
          <div className='w-2/3'>
            <h2 className='text-3xl font-bold mb-4'>What materials are used in your crochet products?</h2>
            <p className='text-lg mb-6'>We use high-quality yarns such as cotton, acrylic, and wool to ensure durability and comfort in our crochet products.</p>
            <h2 className='text-3xl font-bold mb-4'>Do you offer custom crochet orders?</h2>
            <p className='text-lg mb-6'>Yes, we accept custom orders! You can contact us with your specific requirements, and we will be happy to create a unique piece for you.</p>
            <h2 className='text-3xl font-bold mb-4'>What is your return policy?</h2>
            <p className='text-lg mb-6'>We offer a 30-day return policy on all our crochet products. Items must be in their original condition and packaging to be eligible for a return.</p>
            <h2 className='text-3xl font-bold mb-4'>How long does shipping take?</h2>
            <p className='text-lg mb-6'>Shipping times vary based on your location, but typically orders are delivered within 5-10 business days.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Faq;