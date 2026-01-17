import { useState, useEffect } from "react";
import Footer from "./components/footer";
import ProductCard from "./components/productCard";
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

function Product() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };  
    fetchProducts();
  }, []);

  const handleAddToCart = async(productWithVariant) => {
    if(!token) {
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }

    const chosenColour = productWithVariant.selectedColour?.name;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify ({
          product_id: productWithVariant.id,
          name: productWithVariant.name,
          price: productWithVariant.price,
          colour: chosenColour, 
          image: productWithVariant.image_url
        })
      });

      if(response.ok) {
        alert(`${productWithVariant.name} (${chosenColour}) added to cart!`);
      } else if (response.status === 401) {
        alert('Please login to add to cart');
        navigate('/login');
      } else {
        alert('Failed to add item');
      }
    } catch(error) {
        console.error('Error adding to cart: ', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800">
      
      <section className="bg-white py-12 border-b border-stone-200">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                Shop Collection
            </h1>
            <p className="text-stone-500 max-w-xl mx-auto">
                Discover our latest handcrafted plushies, wearables, and accessories. Made with love, just for you.
            </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12">
        
        
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="h-96 bg-stone-200 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        /> 
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-stone-500">
                        No products found. Check back soon!
                    </div>
                )} 
            </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default Product;