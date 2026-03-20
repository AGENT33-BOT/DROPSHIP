import { EntityRepository, Repository } from "typeorm";
import { Supplier } from "../models/supplier";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier> {
  async getActiveSuppliers() {
    return this.find({ where: { active: true } });
  }

  async getSupplierById(id: string) {
    return this.findOne({ where: { id } });
  }

  async getSupplierByType(type: string) {
    return this.findOne({ where: { type, active: true } });
  }

  async updateSupplierCredentials(id: string, apiKey: string, apiSecret: string) {
    return this.update(id, {
      api_key: apiKey,
      api_secret: apiSecret,
      updated_at: new Date(),
    });
  }
}
