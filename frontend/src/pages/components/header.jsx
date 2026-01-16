import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../useAuth';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: loggedIn, logout, userInfo, token } = useAuth();
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL; 
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [cartCount, setCartCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    const isActive = (path) => location.pathname === path;

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Shop', path: '/product' },
        { name: 'FAQ', path: '/faq' },
    ];

    const fetchCartCount = useCallback(async () => {
        if (!token) {
            setCartCount(0);
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                logout();
                return;
            }
            if (res.ok) {
                const data = await res.json();
                // Check if data is array (if you return list) or object (if you return {count: 5})
                // Assuming your API returns the array of items based on your previous code:
                setCartCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (err) {
            console.error('Failed to fetch cart count', err);
        }
    }, [token, logout]);

    const fetchOrderCount = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrderCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (err) {
            console.error('Failed to fetch orders', err);
        }
    }, [token]);

    // 1. Initial Fetch on Load
    useEffect(() => {
        fetchCartCount();
        if(loggedIn) fetchOrderCount();
    }, [fetchCartCount, fetchOrderCount, loggedIn]);

    // 2. NEW: Event Listener for Dynamic Updates
    useEffect(() => {
        // This function runs whenever the 'cartUpdated' event is dispatched
        const handleCartUpdate = () => {
            fetchCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [fetchCartCount]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm font-sans">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-serif font-bold text-stone-800 tracking-tight group-hover:text-orange-600 transition-colors">
                        Crochet<span className="text-orange-500">.</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {links.map(link => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-2 ${
                                isActive(link.path) 
                                ? 'text-orange-600' 
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                        >
                            {link.name}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0'}`}></span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4 md:gap-6">
                    
                    <Link to="/cart" className="relative group text-stone-600 hover:text-orange-600 transition-colors">
                        {loggedIn ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">

                            
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        ) : null}
                    </Link>

                    {loggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 text-stone-600 hover:text-stone-900 focus:outline-none"
                            >
                                <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden border border-stone-300">
                                   <span className="font-bold text-stone-600 uppercase">
                                       {userInfo?.name ? userInfo.name[0] : 'U'}
                                   </span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
                                        <p className="text-xs text-stone-500 uppercase font-semibold">Signed in as</p>
                                        <p className="text-sm font-bold text-stone-800 truncate">{userInfo?.name}</p>
                                    </div>
                                    
                                    <div className="py-1">
                                        <Link to="/orders" className="flex items-center justify-between px-4 py-2 text-sm text-stone-600 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                                            <span>My Orders</span>
                                            {orderCount > 0 && <span className="bg-stone-200 text-stone-600 py-0.5 px-2 rounded-full text-xs font-bold">{orderCount}</span>}
                                        </Link>
                                        {userInfo?.email === ADMIN_EMAIL && (
                                            <Link to="/adminDashboard" className="block px-4 py-2 text-sm text-stone-600 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    <div className="border-t border-stone-100 mt-1 pt-1">
                                        <button 
                                            onClick={() => { logout(); setIsProfileOpen(false); navigate('/'); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:block">
                            <Link to="/login" className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-stone-200">
                                Login
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden text-stone-600 hover:text-stone-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* --- MOBILE NAV OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-stone-100 shadow-inner px-4 py-6 space-y-4 animate-in slide-in-from-top-2">
                    {links.map(link => (
                        <Link 
                            key={link.path}
                            to={link.path} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block text-lg font-medium ${isActive(link.path) ? 'text-orange-600' : 'text-stone-600'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {!loggedIn && (
                         <Link 
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="block w-full text-center py-3 mt-4 rounded-lg bg-stone-900 text-white font-bold"
                        >
                            Login / Register
                         </Link>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;