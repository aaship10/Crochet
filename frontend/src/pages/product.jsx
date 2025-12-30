import Header from "./components/header";
import Footer from "./components/footer";
import ProductCard from "./components/productCard";

function Product() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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