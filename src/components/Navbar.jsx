import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaClone } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <FaClone />
            <span>Website Cloner</span>
          </Link>
          
          <div className="space-x-6">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/saved" 
              className={({ isActive }) => 
                `font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Saved Websites
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;