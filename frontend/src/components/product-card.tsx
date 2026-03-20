'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Product {
  id: string
  title: string
  price: number
  image: string
  rating: number
  reviews: number
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm ml-1">{product.rating}</span>
            <span className="text-gray-500 text-sm ml-2">
              ({product.reviews})
            </span>
          </div>
          <p className="text-xl font-bold text-primary-600">
            ${product.price}
          </p>
        </div>
      </div>
    </Link>
  )
}
