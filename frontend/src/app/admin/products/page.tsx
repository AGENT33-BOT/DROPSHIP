'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  supplierPrice: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  image: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Product>>({})

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    const method = form.id ? 'PATCH' : 'POST'
    const url = form.id 
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${form.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/products`

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (form.id) {
      setProducts(products.map(p => p.id === form.id ? { ...p, ...form } as Product : p))
    } else {
      setProducts([...products, { ...form, id: Date.now().toString() } as Product])
    }
    setShowForm(false)
    setForm({})
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, {
      method: 'DELETE',
    })
    setProducts(products.filter(p => p.id !== id))
  }

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => { setForm({}); setShowForm(true); }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Cost</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded">
                      {product.image && (
                        <Image src={product.image} alt={product.name} fill className="object-cover rounded" />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm">{product.sku}</td>
                <td className="px-4 py-3">${product.price}</td>
                <td className="px-4 py-3 text-gray-500">${product.supplierPrice}</td>
                <td className="px-4 py-3">
                  <span className={product.stock < 10 ? 'text-red-500' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setForm(product); setShowForm(true); }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {form.id ? 'Edit Product' : 'Add Product'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product name"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="SKU"
                value={form.sku || ''}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Supplier Price"
                  value={form.supplierPrice || ''}
                  onChange={(e) => setForm({ ...form, supplierPrice: parseFloat(e.target.value) })}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <input
                type="number"
                placeholder="Stock"
                value={form.stock || ''}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={form.status || 'draft'}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
