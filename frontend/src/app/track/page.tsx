'use client'

import { useState } from 'react'
import { Package, MapPin, CheckCircle, Truck } from 'lucide-react'

interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  description: string
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [tracking, setTracking] = useState<{
    orderId: string
    status: string
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
    events: TrackingEvent[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTracking(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/tracking`)
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setTracking(data)
      }
    } catch {
      setError('Failed to fetch tracking info')
    }

    setLoading(false)
  }

  // Demo data
  const demoTracking = {
    orderId: 'DEMO123',
    status: 'shipped',
    carrier: 'USPS',
    trackingNumber: '9400111899223456789012',
    estimatedDelivery: '2026-03-25',
    events: [
      {
        status: 'delivered',
        location: 'Los Angeles, CA',
        timestamp: '2026-03-20T10:30:00Z',
        description: 'Package delivered to front porch',
      },
      {
        status: 'out_for_delivery',
        location: 'Los Angeles, CA',
        timestamp: '2026-03-20T08:00:00Z',
        description: 'Out for delivery',
      },
      {
        status: 'in_transit',
        location: 'Los Angeles, CA',
        timestamp: '2026-03-19T14:00:00Z',
        description: 'Arrived at local facility',
      },
      {
        status: 'shipped',
        location: 'San Francisco, CA',
        timestamp: '2026-03-18T10:00:00Z',
        description: 'Package shipped',
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="max-w-md mx-auto mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter order ID or tracking number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Demo Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setTracking(demoTracking)}
          className="text-primary-600 hover:underline text-sm"
        >
          View demo tracking
        </button>
      </div>

      {/* Tracking Results */}
      {tracking && (
        <div className="max-w-2xl mx-auto">
          {/* Status Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Order ID</p>
                <p className="font-mono font-bold">{tracking.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Estimated Delivery</p>
                <p className="font-bold">{new Date(tracking.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-semibold">{tracking.carrier}</p>
                  <p className="text-sm text-gray-600">{tracking.trackingNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-6">Shipment Progress</h2>
            <div className="space-y-6">
              {tracking.events.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      event.status === 'delivered' ? 'bg-green-500' : 'bg-primary-500'
                    }`}>
                      {event.status === 'delivered' && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {i < tracking.events.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
