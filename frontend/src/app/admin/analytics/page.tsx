'use client'

import { useState } from 'react'
import { Eye, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface AnalyticsData {
  revenue: { date: string; amount: number }[]
  orders: { date: string; count: number }[]
  topProducts: { name: string; sales: number; revenue: number }[]
  traffic: { source: string; visits: number; conversions: number }[]
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('7d')
  const [data, setData] = useState<AnalyticsData>({
    revenue: [],
    orders: [],
    topProducts: [],
    traffic: [],
  })

  // In production, fetch from API
  const stats = {
    pageViews: 12453,
    uniqueVisitors: 8234,
    conversionRate: 3.2,
    avgOrderValue: 67.45,
    revenue: 8934.56,
    orders: 156,
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg ${
                period === p ? 'bg-primary-600 text-white' : 'bg-gray-100'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Revenue</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
          <p className="text-sm text-green-500 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" /> +12.5%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Orders</span>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats.orders}</p>
          <p className="text-sm text-green-500 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" /> +8.3%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Page Views</span>
            <Eye className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</p>
          <p className="text-sm text-green-500 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" /> +15.2%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Conversion</span>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">{stats.conversionRate}%</p>
          <p className="text-sm text-red-500 flex items-center mt-1">
            <TrendingDown className="w-4 h-4 mr-1" /> -0.4%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Revenue Over Time</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 78, 52, 89, 67, 95].map((height, i) => (
              <div key={i} className="flex-1 bg-primary-100 rounded-t" style={{ height: `${height}%` }}>
                <div className="w-full h-full bg-primary-500 rounded-t opacity-80" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Premium Wireless Earbuds', sales: 45, revenue: 2249.55 },
              { name: 'Smart Fitness Watch', sales: 32, revenue: 2879.68 },
              { name: 'Portable Bluetooth Speaker', sales: 28, revenue: 979.72 },
              { name: 'LED Desk Lamp', sales: 21, revenue: 524.79 },
            ].map((product, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <p className="font-bold">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Organic Search', visits: 4521, conversions: 156 },
              { source: 'Direct', visits: 2134, conversions: 89 },
              { source: 'Social Media', visits: 1245, conversions: 45 },
              { source: 'Referral', visits: 334, conversions: 12 },
            ].map((traffic, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span>{traffic.source}</span>
                  <span className="text-gray-500">{traffic.visits} visits</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(traffic.visits / 4521) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
