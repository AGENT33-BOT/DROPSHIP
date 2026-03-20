import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your order. We've sent a confirmation email with your order details.
      </p>
      <div className="space-x-4">
        <Link
          href="/products"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50"
        >
          View Orders
        </Link>
      </div>
    </div>
  )
}
