import React from 'react'
import { Link, useLocation } from 'react-router-dom';


function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { label: 'Appliances', icon: '📊', path: '/cms/appliances' },
        // { label: 'Projects', icon: '📁', path: '/projects' },
        // { label: 'Tasks', icon: '✓', path: '/tasks' },
        // { label: 'Calendar', icon: '📅', path: '/calendar' },
        // { label: 'Reports', icon: '📈', path: '/reports' },
        // { label: 'Settings', icon: '⚙️', path: '/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${isActive
                                        ? 'bg-gray-200 text-gray-900 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon && (
                                        <span className="mr-3 text-gray-500">{item.icon}</span>
                                    )}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar