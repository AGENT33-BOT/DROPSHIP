import { EntityRepository, Repository } from "typeorm";
import { Notification } from "../models/notification";

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async createNotification(data: Partial<Notification>) {
    const notification = this.create({
      ...data,
      status: 'pending',
    });
    return this.save(notification);
  }

  async markAsSent(id: string) {
    return this.update(id, {
      status: 'sent',
      sentAt: new Date(),
    });
  }

  async markAsFailed(id: string, error: string) {
    return this.update(id, {
      status: 'failed',
      errorMessage: error,
    });
  }

  async getPendingNotifications() {
    return this.find({
      where: { status: 'pending' },
      order: { createdAt: 'ASC' },
    });
  }

  async getCustomerNotifications(customerId: string) {
    return this.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
