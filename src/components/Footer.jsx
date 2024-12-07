import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <p className="text-gray-400 text-sm">
            Discover the best hotels for your travel destinations. We provide the most convenient booking experience to make your journey unforgettable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-400">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400">About Us</Link>
            </li>
            <li>
              <Link to="/hotels" className="hover:text-blue-400">Hotels</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400 text-sm">
            <span className="block">Email: support@hotelbooking.com</span>
            <span className="block">Phone: +1 (800) 123-4567</span>
            <span className="block">Address: 123 Main Street, Anytown, USA</span>
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-400">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-blue-300 hover:text-blue-200">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-gray-200">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Hotel Booking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
