import { Router } from "express";
import { CJService } from "../../services/cj.service";

export default (router: Router, container) => {
  // Import product from CJ
  router.post("/supplier/import", async (req, res) => {
    try {
      const { productId, sku } = req.body;
      
      if (!productId && !sku) {
        return res.status(400).json({ 
          error: "productId or sku required" 
        });
      }

      // Get CJ credentials from config
      const cjApiKey = process.env.CJ_API_KEY;
      const cjApiSecret = process.env.CJ_API_SECRET;
      
      if (!cjApiKey || !cjApiSecret) {
        return res.status(500).json({ 
          error: "CJ API not configured" 
        });
      }

      const cj = new CJService(cjApiKey, cjApiSecret);
      
      // Fetch product
      let product;
      if (productId) {
        product = await cj.getProduct(productId);
      } else {
        const products = await cj.searchProducts(sku);
        product = products[0];
      }

      if (!product) {
        return res.status(404).json({ 
          error: "Product not found" 
        });
      }

      // Return product data for AI processing
      res.json({
        success: true,
        product: {
          supplierId: product.id,
          supplierSku: product.sku,
          name: product.name,
          price: product.price,
          description: product.description,
          images: product.images,
          variants: product.variants,
          weight: product.weight,
        }
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Sync inventory from CJ
  router.post("/supplier/sync", async (req, res) => {
    try {
      const cjApiKey = process.env.CJ_API_KEY;
      const cjApiSecret = process.env.CJ_API_SECRET;
      
      const cj = new CJService(cjApiKey, cjApiSecret);
      
      // Get products (paginated)
      const allProducts = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const products = await cj.getProducts(page, 50);
        allProducts.push(...products);
        page++;
        hasMore = products.length === 50;
      }

      // In production, you'd update the database here
      
      res.json({
        success: true,
        synced: allProducts.length,
        products: allProducts.map(p => ({
          supplierId: p.id,
          sku: p.sku,
          price: p.price,
        }))
      });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Create order on CJ
  router.post("/supplier/order", async (req, res) => {
    try {
      const { productId, variantId, quantity, shippingAddress } = req.body;
      
      const cjApiKey = process.env.CJ_API_KEY;
      const cjApiSecret = process.env.CJ_API_SECRET;
      
      const cj = new CJService(cjApiKey, cjApiSecret);
      
      // Get shipping rates first
      const rates = await cj.getShippingRates(
        productId, 
        quantity, 
        shippingAddress.countryCode
      );
      
      if (!rates || rates.length === 0) {
        return res.status(400).json({ 
          error: "No shipping options available" 
        });
      }

      // Create order with first shipping option
      const order = await cj.createOrder({
        productId,
        variantId,
        quantity,
        countryCode: shippingAddress.countryCode,
        shippingMethod: rates[0].id,
        address: shippingAddress,
      });

      res.json({
        success: true,
        orderId: order.orderId,
        status: order.status,
      });
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Get tracking
  router.get("/supplier/tracking/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      
      const cjApiKey = process.env.CJ_API_KEY;
      const cjApiSecret = process.env.CJ_API_SECRET;
      
      const cj = new CJService(cjApiKey, cjApiSecret);
      const tracking = await cj.getTracking(orderId);

      res.json({
        success: true,
        tracking,
      });
    } catch (error) {
      console.error("Tracking error:", error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  });
};
