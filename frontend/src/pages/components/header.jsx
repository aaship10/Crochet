import { Link, useLocation } from 'react-router-dom';
function Header() {

    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const links = [
        { name: 'Home', path: '/home' },
        { name: 'About', path: '/about' },
        { name: 'Product', path: '/product' },
        { name: 'FAQ', path: '/faq' },
    ];

    const authLinks = [
        { name: 'Login', path: '/login' },
        { name: 'Sign Up', path: '/signup' },
    ];

    return (
        <header className="flex flex-row justify-between items-center bg-purple-200 p-4 sticky top-0 z-10 left-0 right-0">
            <div className="flex flex-row justify-center items-center">
                {
                    links.map(link => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`mx-2 px-4 ${isActive(link.path) ? 'font-extrabold text-purple-900' : 'font-medium text-purple-700'}`}
                        >
                            {link.name}
                        </Link>
                    ))
                }
            </div>
            <div className="flex flex-row justify-center items-center">
                {
                    authLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`mx-2 px-4 ${isActive(link.path) ? 'font-bold text-purple-900' : 'font-medium text-purple-700'}`}
                        >
                            {link.name}
                        </Link>
                    ))
                }
            </div>
        </header>
    );
}

export default Header;