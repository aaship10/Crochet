import { useState } from "react";
import Footer from "./components/footer";
import ProductCard from "./components/productCard";
import { useEffect } from "react";

function Product() {
  const [products, setProducts] = useState([]);
  const [selectedColour, setSelectedColour] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };  
    fetchProducts();
  }, []);

  const handleAddToCart = async(product) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify ({
          product_id: product.id,
          name: product.name,
          price: product.price,
          colour: selectedColour.name,
          image: product.image_url
        })
      });
      console.log(product.name);
      console.log(response);
      if(response.ok) {
        alert(`${product.name} added to cart!`);
      } else {
        alert('Failed to add item');
      }
    } catch(error) {
        console.error('Error adding to cart: ', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="flex flex-row flex-wrap justify-center items-center p-4 gap-10">
            {
              products.length > 0 ? 
              (products.map((product) => (
              <ProductCard 
                key = {product.id}
                product = {product}
                onAddToCart={() => handleAddToCart(product)}
                selectedColour={selectedColour}
                setSelectedColour={setSelectedColour} 
              /> 
              ))
            ) : (
              <p> Loading products...</p>
            )} 
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Product;