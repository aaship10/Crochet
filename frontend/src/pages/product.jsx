import Footer from "./components/footer";
import ProductCard from "./components/productCard";
// import { useEffect } from "react";

function Product() {

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/products');
  //       const data = await response.json();
  //       console.log(data); 
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };  
  //   fetchProducts();
  // }, []);

  const handleAddToCart = async() => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          productId: 123,
          name: "socks",
          price: 45.99,
          colour: "red"
        })
      });

      if(response.ok) {
        alert('{product.name} added to cart!');
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
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
            <ProductCard onAddToCart={() => handleAddToCart()} /> 
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Product;