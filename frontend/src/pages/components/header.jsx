import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import  { useAuth } from '../useAuth';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const { user: loggedIn, logout, userInfo, token } = useAuth();

    const isActive = (path) => location.pathname === path;

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Product', path: '/product' },
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
                // session expired or invalid, clear auth
                logout();
                setCartCount(0);
                return;
            }
            if (!res.ok) return;
            const data = await res.json();
            setCartCount(Array.isArray(data) ? data.length : 0);
        } catch (err) {
            console.error('Failed to fetch cart count', err);
        }
    }, [token, logout]);

    const fetchOrders = useCallback(async () => {
        if (!token) {
            setOrderHistory([]);
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                logout();
                setOrderHistory([]);
                return;
            }
            if (!res.ok) return;
            const data = await res.json();
            setOrderHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        }
    }, [token, logout]);

    useEffect(() => {
        const run = async () => { await fetchCartCount(); };
        run();
    }, [fetchCartCount]);

    const authLinks = loggedIn ? [] : [
        { name: 'Login / Register', path: '/login' }, 
    ];



    return (
        // Added 'backdrop-blur-md' for a frosted glass effect
        <header className="flex flex-row justify-between items-center bg-purple-200/80 backdrop-blur-sm p-4 sticky top-0 z-10 w-full shadow-sm">
            
            {/* Main Navigation Links */}
            <div className="flex flex-row justify-center items-center">
                {links.map(link => (
                    <Link 
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-4 transition-colors ${
                            isActive(link.path) 
                            ? 'font-extrabold text-purple-900' 
                            : 'font-medium text-purple-700 hover:text-purple-900'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Auth Links & Logout Button */}
            <div className="flex flex-row justify-center items-center">
                {authLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-4 transition-colors ${
                            isActive(link.path) 
                            ? 'font-bold text-purple-900' 
                            : 'font-medium text-purple-700 hover:text-purple-900'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Profile Dropdown */}
                {loggedIn && (
                    <div className="relative">
                        <button
                            onClick={() => { const newOpen = !open; setOpen(newOpen); if (newOpen) fetchCartCount(); }}
                            className="mx-2 px-4 font-medium text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-2"
                        >
                            {userInfo?.name ? userInfo.name : 'Profile'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20"
                            fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-sm text-gray-600">Signed in as</p>
                                    <p className="font-medium text-gray-800">{userInfo?.name || 'User'}</p>
                                </div>
                                <Link to="/cart" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                                    <span>Cart</span>
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">{cartCount}</span>
                                </Link>

                                {/* Orders toggler */}
                                <div className="w-full">
                                    <button
                                        onClick={() => { const newOpen = !ordersOpen; setOrdersOpen(newOpen); if (newOpen) fetchOrders(); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                                    >
                                        <span>Orders</span>
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-gray-500 rounded-full">{orderHistory.length}</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => { logout(); setOpen(false); navigate('/'); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;