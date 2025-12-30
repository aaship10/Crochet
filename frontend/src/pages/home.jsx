import Header from './components/header';
import Footer from './components/footer';
import ProductCard from './components/productCard';
function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow'>
        <div className='flex flex-row flex-wrap justify-center items-center gap-4 p-4'>
          <div className='w-screen bg-indigo-100 flex justify-left items-left rounded-lg shadow-md font-extrabold p-8 flex-row'>
            <div className='flex flex-col justify-left items-left'>
              <h1 className='text-indigo-900 font-extrabold text-7xl'>Crochet with Love!</h1>
              <h6 className='text-indigo-600'>With care and love in each piece made</h6>
            </div>
            <div className='h-40 bg-gray-200 rounded-md mb-4'></div>
          </div>  

          <div className='w-screen flex justify-center items-center font-extrabold p-8 flex-col'>
            <div className='text-4xl'>
              Top Selling Products
            </div>
            <div className='flex flex-row flex-wrap justify-center items-center gap-24 mt-4 py-3'>
              {/* Product Cards */}
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
            <div>
              <button className='bg-fuchsia-300 text-black px-56 py-3 rounded-md hover:bg-fuchsia-500 hover:text-white mt-6'>
                View All Products
              </button>
            </div>
          </div>   
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;