import { Medusa } from "@medusajs/medusa";
import { Router } from "@medusajs/medusa";
import { ConfigModule, MedusaContainer } from "@medusajs/medusa/types";

export default function healthRouter(router: Router): void {
  router.get("/health", async (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.VERSION || "1.0.0"
    });
  });
}
