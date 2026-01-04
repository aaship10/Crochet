import Footer from "./components/footer";
import ProductCard from "./components/productCard";
import { useEffect } from "react";

function Product() {

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        console.log(data); // For now, just log the fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };  
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="flex flex-row flex-wrap justify-center items-center p-4 gap-10">
            <ProductCard /> 
            <ProductCard />
            <ProductCard /> 
            <ProductCard /> 
            <ProductCard /> 
            <ProductCard />
            <ProductCard /> 
            <ProductCard /> 
            <ProductCard /> 
            <ProductCard />
            <ProductCard /> 
            <ProductCard /> 
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Product;