import { Router } from "express";
import { PricingService } from "../../services/pricing.service";

export default (router: Router) => {
  // Calculate price
  router.post("/pricing/calculate", async (req, res) => {
    try {
      const { supplierPrice, product } = req.body;
      
      if (!supplierPrice) {
        return res.status(400).json({ 
          error: "supplierPrice required" 
        });
      }

      const pricingService = container.resolve<PricingService>("pricingService");
      const price = await pricingService.calculatePrice(
        supplierPrice,
        product || {}
      );

      const margin = ((price - supplierPrice) / price * 100).toFixed(2);

      res.json({
        success: true,
        price,
        cost: supplierPrice,
        margin: `${margin}%`,
      });
    } catch (error) {
      console.error("Pricing error:", error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Get pricing rules
  router.get("/pricing/rules", async (req, res) => {
    try {
      const pricingService = container.resolve<PricingService>("pricingService");
      const rules = await pricingService.getActiveRules();

      res.json({
        success: true,
        rules,
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Create pricing rule
  router.post("/pricing/rules", async (req, res) => {
    try {
      const ruleData = req.body;
      
      const pricingService = container.resolve<PricingService>("pricingService");
      const rule = await pricingService.createRule(ruleData);

      res.json({
        success: true,
        rule,
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Check margin risks
  router.get("/pricing/risks", async (req, res) => {
    try {
      // In production, you'd query products with low margins
      // For now, return empty array
      res.json({
        success: true,
        risks: [],
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  });
};
