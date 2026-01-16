import Home from './pages/home'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Product from './pages/product'
import { Routes, Route } from 'react-router-dom'  
import About from './pages/about'
import Faq from './pages/faq'
import Login from './pages/login'
import Cart from './pages/cart'
import Orders from './pages/orders'
import Header from './pages/components/header'
import  { AuthProvider } from './pages/AuthProvider'
import Checkout from './pages/checkout'
import AdminDashboard from './pages/AdminDashboard'
// import PaymentPage from './pages/checkout'
import { useEffect, useState } from 'react';
function App() {

  const [storeCoords, setStoreCoords] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);
  
  useEffect(() => {
      fetch('http://localhost:5000/api/store/location')
          .then(res => res.json())
          .then(data => setAdminEmail(data))
          .catch(console.error);
  }, []);


  useEffect(() => {
    fetch('http://localhost:5000/api/email')
      .then(res => res.json())
      .then(data => setStoreCoords(data))
      .catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <Header adminEmail={adminEmail?.AdminEmail} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={storeCoords ? ( <Cart lati={storeCoords.lat} longi={storeCoords.lng} /> ) : ( <div className="p-10 text-center">Loading store location...</div> )}
        />

        <Route path="/orders" element={<Orders />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        {/* <Route path='/checkout' element={<PaymentPage />} /> */}
      </Routes>
    </AuthProvider>
  )
}

export default App
