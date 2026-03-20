import { EntityRepository, Repository } from "typeorm";
import { PricingRule } from "../models/pricing-rule";

@EntityRepository(PricingRule)
export class PricingRepository extends Repository<PricingRule> {
  async getActiveRules() {
    return this.find({
      where: { active: true },
      order: { priority: 'DESC' },
    });
  }

  async calculatePrice(supplierPrice: number, product: {
    category?: string;
    supplier?: string;
    margin?: number;
  }): Promise<number> {
    const rules = await this.getActiveRules();
    
    let finalPrice = supplierPrice;
    let appliedRule: string | null = null;

    for (const rule of rules) {
      // Check if rule applies
      if (this.ruleApplies(rule, product)) {
        if (rule.markupType === 'percentage') {
          finalPrice = finalPrice * (1 + rule.markupValue / 100);
        } else if (rule.markupType === 'fixed') {
          finalPrice = finalPrice + rule.markupValue;
        }
        appliedRule = rule.name;
        
        // Check minimum margin
        if (rule.minMargin) {
          const margin = ((finalPrice - supplierPrice) / finalPrice) * 100;
          if (margin < rule.minMargin) {
            finalPrice = supplierPrice / (1 - rule.minMargin / 100);
          }
        }
        break; // Apply first matching rule
      }
    }

    return Math.round(finalPrice * 100) / 100;
  }

  private ruleApplies(rule: PricingRule, product: any): boolean {
    if (!rule.conditionType || !rule.conditionValue) {
      return true; // No condition = always apply
    }

    const value = product[rule.conditionType];
    const condition = rule.conditionValue;

    switch (condition.operator) {
      case 'eq':
        return value === condition.value;
      case 'gt':
        return value > condition.value;
      case 'lt':
        return value < condition.value;
      case 'in':
        return condition.value.includes(value);
      default:
        return true;
    }
  }
}
