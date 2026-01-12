import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './components/footer';
import img1 from '/p2-1.jpeg'; // Keeping your original image

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800">
      <main className="flex-grow">
        
        <section className="relative overflow-hidden bg-orange-50 py-20 sm:py-32">
          <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <span className="uppercase tracking-widest text-sm text-orange-600 font-bold mb-4 block">
                Handcrafted with Joy
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-stone-900 mb-6 leading-tight font-serif">
                Crochet with <span className="text-orange-400">Love!</span>
              </h1>
              <p className="text-xl text-stone-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover the warmth of handmade artistry. Each stitch is woven with care to bring you cozy wearables, adorable plushies, and unique decor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/product" 
                  className="bg-stone-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-500 transition-all duration-300 shadow-lg hover:shadow-orange-200"
                >
                  Shop Collection
                </Link>
                <button className="px-8 py-4 rounded-full font-semibold border-2 border-stone-300 hover:border-stone-900 transition-all duration-300">
                  Custom Orders
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="absolute top-0 right-0 bg-orange-200 w-72 h-72 rounded-full blur-3xl opacity-50 -z-10"></div>
              <div className="absolute bottom-0 left-0 bg-purple-200 w-72 h-72 rounded-full blur-3xl opacity-50 -z-10"></div>
              <img 
                src={img1} 
                alt="Cozy Crochet Item" 
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" 
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="p-6 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  🧶
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">100% Handmade</h3>
                <p className="text-stone-600">Every item is crafted by hand, ensuring that no two pieces are exactly alike.</p>
              </div>
              <div className="p-6 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  ✨
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">Customizable</h3>
                <p className="text-stone-600">Want a different color? A specific size? We love bringing your custom ideas to life.</p>
              </div>
              <div className="p-6 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  🌿
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">Sustainable</h3>
                <p className="text-stone-600">We use high-quality, eco-friendly yarns to ensure our planet stays as cozy as you.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-stone-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">Find Your Perfect Piece</h2>
            <p className="text-stone-400 mb-10 max-w-2xl mx-auto">
              Whether you are looking for a gift for a loved one or a treat for yourself, our collection has something special for everyone.
            </p>
            
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/product" className="group relative overflow-hidden rounded-lg aspect-square bg-stone-800 flex items-center justify-center">
                <span className="z-10 text-2xl font-bold group-hover:scale-110 transition-transform">Plushies</span>
                <div className="absolute inset-0 bg-white opacity-5 group-hover:opacity-10 transition-opacity"></div>
              </Link>
              <Link to="/product" className="group relative overflow-hidden rounded-lg aspect-square bg-stone-800 flex items-center justify-center">
                <span className="z-10 text-2xl font-bold group-hover:scale-110 transition-transform">Wearables</span>
                <div className="absolute inset-0 bg-white opacity-5 group-hover:opacity-10 transition-opacity"></div>
              </Link>
              <Link to="/product" className="group relative overflow-hidden rounded-lg aspect-square bg-stone-800 flex items-center justify-center">
                 <span className="z-10 text-2xl font-bold group-hover:scale-110 transition-transform">Accessories</span>
                 <div className="absolute inset-0 bg-white opacity-5 group-hover:opacity-10 transition-opacity"></div>
              </Link>
            </div> */}

            <div className="mt-12">
              <Link to="/product" className="inline-block border border-white text-white px-10 py-3 rounded-full hover:bg-white hover:text-stone-900 transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default Home;