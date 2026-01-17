import Footer from './components/footer';
import { Link } from 'react-router-dom';
import img1 from '/aboutphoto.jpeg';

function About() {
  return (
    <>
    <title>About Us</title>
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-800 font-sans">
      <main className="flex-grow">
        
        <section className="bg-white py-16 border-b border-stone-100">
            <div className="container mx-auto px-6 text-center">
                <p className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-3">
                    Our Story
                </p>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6">
                    Weaving Warmth <br /> into Every Stitch
                </h1>
            </div>
        </section>

        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute top-4 -left-4 w-full h-full border-2 border-orange-200 rounded-2xl z-0 hidden md:block"></div>
                        <img 
                            src={img1} 
                            alt="Crochet Workshop" 
                            className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-xl" 
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg z-20 hidden md:block">
                            <p className="font-serif text-2xl font-bold text-orange-500">100%</p>
                            <p className="text-sm font-bold text-stone-600 uppercase tracking-wide">Handmade</p>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-stone-900">
                            Welcome to our Crochet Shop!
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            We are passionate about creating beautiful, handcrafted crochet items that bring joy and warmth to your life. In a world of fast fashion, we believe in the beauty of slowing down.
                        </p>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            Each piece is made with love and attention to detail, ensuring the highest quality for our customers. Whether you're looking for a simple keychain, a stylish accessory, or a unique gift, we have something special for everyone.
                        </p>
                        <div className="pt-4">
                            <p className="font-serif italic text-xl text-stone-800 border-l-4 border-orange-400 pl-4">
                                "Thank you for supporting our small business and allowing us to share our craft with you!"
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section className="bg-stone-900 text-white py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-stone-800 rounded-full flex items-center justify-center text-3xl">
                            🧶
                        </div>
                        <h3 className="text-xl font-bold font-serif">Premium Materials</h3>
                        <p className="text-stone-400">
                            We source only the softest, most durable yarns to ensure your items last a lifetime.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-stone-800 rounded-full flex items-center justify-center text-3xl">
                            ❤️
                        </div>
                        <h3 className="text-xl font-bold font-serif">Made with Love</h3>
                        <p className="text-stone-400">
                            No machines here. Every loop and stitch is created by human hands with care.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-stone-800 rounded-full flex items-center justify-center text-3xl">
                            🎁
                        </div>
                        <h3 className="text-xl font-bold font-serif">Perfect Gifting</h3>
                        <p className="text-stone-400">
                            Unique, one-of-a-kind items that make for unforgettable gifts for your loved ones.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <section className="py-20 bg-orange-50 text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-stone-900">Ready to find something cozy?</h2>
            <Link to="/product" className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg">
                Explore Our Collection
            </Link>
        </section>

      </main>
      <Footer />
    </div>
    </>
  );
}

export default About;