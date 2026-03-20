/**
 * CJ Dropshipping API Service
 * 
 * Documentation: https://developers.cjdropshipping.com/
 */

const CJ_API_BASE = 'https://api.cjdropshipping.com';

export interface CJProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  weight: number;
  category: string;
  images: string[];
  description: string;
  variants: CJVariant[];
}

export interface CJVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export interface CJOrder {
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export class CJService {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private async request(endpoint: string, method: string = 'GET', body?: object) {
    const timestamp = Date.now();
    const signStr = this.apiKey + this.apiSecret + timestamp;
    
    // Simple hash (in production use proper crypto)
    const sign = Buffer.from(signStr).toString('base64');

    const response = await fetch(`${CJ_API_BASE}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'CJ-API-KEY': this.apiKey,
        'CJ-API-SIGN': sign,
        'CJ-API-TIMESTAMP': timestamp.toString(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return response.json();
  }

  // Get product list
  async getProducts(page: number = 1, pageSize: number = 20): Promise<CJProduct[]> {
    const result = await this.request(
      `/api/v1/product/list?page=${page}&pageSize=${pageSize}`
    );
    return result.data?.list || [];
  }

  // Get product detail
  async getProduct(productId: string): Promise<CJProduct> {
    const result = await this.request(
      `/api/v1/product/detail?id=${productId}`
    );
    return result.data;
  }

  // Search products
  async searchProducts(keyword: string): Promise<CJProduct[]> {
    const result = await this.request(
      `/api/v1/product/search?keyword=${encodeURIComponent(keyword)}`
    );
    return result.data?.list || [];
  }

  // Get shipping rates
  async getShippingRates(productId: string, quantity: number, countryCode: string) {
    const result = await this.request('/api/v1/logistics/freight', 'POST', {
      productId,
      quantity,
      countryCode,
    });
    return result.data?.list || [];
  }

  // Create order
  async createOrder(orderData: {
    productId: string;
    variantId: string;
    quantity: number;
    countryCode: string;
    shippingMethod: string;
    address: {
      name: string;
      street1: string;
      city: string;
      state: string;
      countryCode: string;
      zipCode: string;
      phone: string;
      email: string;
    };
  }): Promise<CJOrder> {
    const result = await this.request('/api/v1/order/create', 'POST', orderData);
    return {
      orderId: result.data?.orderId,
      status: 'pending',
    };
  }

  // Get order status
  async getOrder(orderId: string): Promise<CJOrder> {
    const result = await this.request(`/api/v1/order/detail?id=${orderId}`);
    const data = result.data || {};
    return {
      orderId: data.orderId,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      status: this.mapStatus(data.status),
    };
  }

  // Get tracking info
  async getTracking(orderId: string) {
    const result = await this.request(`/api/v1/order/logistics?id=${orderId}`);
    return result.data;
  }

  private mapStatus(status: number): CJOrder['status'] {
    const statusMap: Record<number, CJOrder['status']> = {
      1: 'pending',
      2: 'processing',
      3: 'shipped',
      4: 'delivered',
      5: 'cancelled',
    };
    return statusMap[status] || 'pending';
  }
}

export default CJService;
