'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [search, setSearch] = useState('')

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-600">
            DropshipPro
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 py-3 border-t">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <Link href="/products" className="hover:text-primary-600">All Products</Link>
          <Link href="/categories" className="hover:text-primary-600">Categories</Link>
          <Link href="/about" className="hover:text-primary-600">About</Link>
        </nav>
      </div>
    </header>
  )
}
