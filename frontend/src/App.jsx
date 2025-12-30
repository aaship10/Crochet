import Home from './pages/home'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Product from './pages/product'
import { Routes, Route } from 'react-router-dom'  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
