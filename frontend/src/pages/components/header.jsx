import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(() => {
        return localStorage.getItem('loggedIn') === 'true';
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setLoggedIn(localStorage.getItem('loggedIn') === 'true');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Product', path: '/product' },
        { name: 'FAQ', path: '/faq' },
    ];

    // Removed 'Logout' from here, handled by the button below
    const authLinks = loggedIn ? [
        { name: 'Cart', path: '/cart' },
        // { name: 'Profile', path: '/profile' },
        // { name: 'Orders', path: '/orders' },
    ] : [
        // Points to /login, which now handles both Login & Signup
        { name: 'Login / Register', path: '/login' }, 
    ];

    const handleLogout = () => {
        localStorage.removeItem('loggedIn'); 
        setLoggedIn(false); 
        navigate('/');
    };

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

                {/* Conditional Logout Button */}
                {loggedIn && (
                    <button
                        onClick={handleLogout}
                        className="mx-2 px-4 font-medium text-purple-700 hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;