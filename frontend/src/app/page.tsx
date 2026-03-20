import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

export default function Home() {
  const products = [
    {
      id: '1',
      title: 'Premium Wireless Earbuds',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      rating: 4.5,
      reviews: 128,
    },
    {
      id: '2',
      title: 'Smart Fitness Watch',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      rating: 4.8,
      reviews: 256,
    },
    {
      id: '3',
      title: 'Portable Bluetooth Speaker',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      rating: 4.3,
      reviews: 89,
    },
    {
      id: '4',
      title: 'LED Desk Lamp',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      rating: 4.6,
      reviews: 167,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Premium Products, Direct to You
        </h1>
        <p className="text-gray-600 mb-6">
          Quality dropshipped products with fast shipping and excellent customer service
        </p>
        <Link 
          href="/products"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Shop Now
        </Link>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
