import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About */}
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold text-white mb-4">NGO Portal</h2>
            <p className="text-gray-400 mb-4">
              A dedicated platform to connect donors, volunteers, and organizations for a better world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-purple-400 hover:underline">Home</a></li>
              <li><a href="/about" className="hover:text-purple-400 hover:underline">About Us</a></li>
              <li><a href="/campaigns" className="hover:text-purple-400 hover:underline">Campaigns</a></li>
              <li><a href="/contact" className="hover:text-purple-400 hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Charity Lane, Hope City, 12345</li>
              <li>Email: contact@ngoportal.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Join Our Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest projects and success stories.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-r-md hover:bg-purple-700 transition-colors duration-300"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} NGO Portal. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}