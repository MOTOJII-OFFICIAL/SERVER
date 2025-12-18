import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartsOrder } from './entities/parts-order.entity';
import { PartsOrderItem } from './entities/parts-order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';
import { CreatePartsOrderDto } from './dto/create-parts-order.dto';
import { OrderStatus } from 'src/enum';

@Injectable()
export class PartsOrderService {
  constructor(
    @InjectRepository(PartsOrder)
    private orderRepository: Repository<PartsOrder>,
    @InjectRepository(PartsOrderItem)
    private orderItemRepository: Repository<PartsOrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CarAccessoriesParts)
    private partsRepository: Repository<CarAccessoriesParts>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreatePartsOrderDto): Promise<PartsOrder | null> {
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['part'],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    for (const cartItem of cartItems) {
      if (cartItem.part.stockQuantity < cartItem.quantity) {
        throw new BadRequestException(`Insufficient stock for ${cartItem.part.name}`);
      }
      totalAmount += cartItem.part.price * cartItem.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order
    const order = this.orderRepository.create({
      userId,
      orderNumber,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      createdBy: userId,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items and update stock
    for (const cartItem of cartItems) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        partId: cartItem.partId,
        quantity: cartItem.quantity,
        unitPrice: cartItem.part.price,
        totalPrice: cartItem.part.price * cartItem.quantity,
        createdBy: userId,
      });

      await this.orderItemRepository.save(orderItem);

      // Update stock
      await this.partsRepository.update(
        { id: cartItem.partId },
        { stockQuantity: cartItem.part.stockQuantity - cartItem.quantity }
      );
    }

    // Clear cart
    await this.cartRepository.delete({ userId });

    const finalOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['orderItems', 'orderItems.part'],
    });

    return finalOrder;
  }

  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.part'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, adminId: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.orderStatus = status;
    order.updatedBy = adminId;

    if (status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    return this.orderRepository.save(order);
  }

  async getAllOrders() {
    return this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.part'],
      order: { createdAt: 'DESC' },
    });
  }
}