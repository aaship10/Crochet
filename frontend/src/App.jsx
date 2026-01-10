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
import PaymentPage from './pages/checkout'
function App() {
  return (
    <AuthProvider>
      <Header  />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        <Route path='/checkout' element={<PaymentPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
