import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BookImage, CircuitBoard, Download, FolderTree,
    GalleryHorizontal, Images, MessageSquareQuote,
    PackageSearch, ScrollText, ChevronLeft, ChevronRight,
    Menu, User2
} from 'lucide-react';


function Sidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Appliances', icon: <CircuitBoard size={20} />, path: '/cms/appliances' },
        { label: 'Products', icon: <PackageSearch size={20} />, path: '/cms/products' },
        { label: 'Categories', icon: <FolderTree size={20} />, path: '/cms/categories' },
        { label: 'Carousels', icon: <GalleryHorizontal size={20} />, path: '/cms/carousels' },
        { label: 'Galleries', icon: <BookImage size={20} />, path: '/cms/galleries' },
        { label: 'Quotes', icon: <MessageSquareQuote size={20} />, path: '/cms/quotes' },
        { label: 'Enquiries', icon: <ScrollText size={20} />, path: '/cms/enquiries' },
        { label: 'Images', icon: <Images size={20} />, path: '/cms/images' },
        { label: 'Downloads', icon: <Download size={20} />, path: '/cms/downloads' },
        { label: 'Users', icon: <User2 size={20} />, path: '/cms/users' },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Button (hidden on desktop) */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md bg-white shadow-md"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed lg:relative z-40 h-screen bg-white border-r border-gray-200 flex flex-col
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-[70px]' : 'w-[250px]'} /* Fixed widths using arbitrary values */
                ${isMobileMenuOpen ? 'left-0' : '-left-full lg:left-0'}
                flex-none /* Prevent flex shrinking */
            `}>
                {/* Collapse Button */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    {!isCollapsed && (
                        <h2 className="text-lg font-semibold whitespace-nowrap">GridKing</h2>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center w-full px-4 py-3 text-left 
                                            transition-colors duration-200
                                            ${isActive
                                                ? 'bg-gray-200 text-gray-900 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                            ${isCollapsed ? 'justify-center' : ''}
                                        `}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <span className={`text-gray-500 ${isCollapsed ? 'mr-0' : 'mr-3'}`}>
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && (
                                            <span className="whitespace-nowrap">{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        className={`
                            flex items-center text-gray-700 hover:text-gray-900 w-full
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? "Logout" : ""}
                    >
                        <svg
                            className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Overlay for mobile (only visible when mobile menu is open) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
}

export default Sidebar;