import React, { useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-500">
              Airobuddy
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-500 transition"
            >
              About Us
            </Link>
            <Link
              to="/hotels"
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Hotels
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-500 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col space-y-2 px-4 py-2">
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-500 transition"
            >
              About Us
            </Link>
            <Link
              to="/hotels"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Hotels
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
