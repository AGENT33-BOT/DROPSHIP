import { EntityRepository, Repository } from "typeorm";
import { Fulfillment } from "../models/fulfillment";

@EntityRepository(Fulfillment)
export class FulfillmentRepository extends Repository<Fulfillment> {
  async createFulfillment(orderId: string, data: Partial<Fulfillment>) {
    const fulfillment = this.create({
      orderId,
      ...data,
      status: 'pending',
    });
    return this.save(fulfillment);
  }

  async getFulfillmentByOrder(orderId: string) {
    return this.findOne({ where: { orderId } });
  }

  async updateStatus(id: string, status: Fulfillment['status'], data?: Partial<Fulfillment>) {
    return this.update(id, {
      status,
      ...data,
    });
  }

  async getPendingFulfillments() {
    return this.find({
      where: { status: 'pending' },
      order: { createdAt: 'ASC' },
    });
  }

  async getFailedFulfillments() {
    return this.find({
      where: { 
        status: 'failed',
        retryCount: 3, // Less than max retries
      },
    });
  }
}
