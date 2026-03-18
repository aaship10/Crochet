import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 py-16 font-sans border-t border-stone-800">
      <div className="container mx-auto px-6">
        
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-serif font-bold text-white tracking-tight">
                Crochet<span className="text-orange-500">.</span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Handcrafted with love, stitch by stitch. Bringing warmth and coziness to your home and wardrobe since 2024.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-serif tracking-wide">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/product" className="hover:text-orange-500 transition-colors">All Products</Link></li>
              <li><Link to="/product" className="hover:text-orange-500 transition-colors">New Arrivals</Link></li>
              <li><Link to="/product" className="hover:text-orange-500 transition-colors">Accessories</Link></li>
              <li><Link to="/product" className="hover:text-orange-500 transition-colors">Custom Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-serif tracking-wide">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link to="/shipping" className="hover:text-orange-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-serif tracking-wide">Stay Connected</h4>
            <p className="text-sm text-stone-400 mb-4">
              Follow us on social media for new drops and behind-the-scenes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
        </div> */}

        {/* <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500"> */}
          <p>&copy; {year} My Website. All rights reserved.</p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0">
             <Link to="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
             <Link to="/terms" className="hover:text-stone-300">Terms of Service</Link>
          </div> */}
        {/* </div> */}

      </div>
    </footer>
  );
}

export default Footer;