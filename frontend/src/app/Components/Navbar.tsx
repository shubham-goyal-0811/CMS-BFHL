// components/Navbar.tsx
'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CMS
        </Link>

        {/* Right-side Links */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition">
            Cart
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
