import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CarAccessoriesParts)
    private partsRepository: Repository<CarAccessoriesParts>,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const part = await this.partsRepository.findOne({
      where: { id: addToCartDto.partId, status: DefaultStatus.ACTIVE },
    });

    if (!part) {
      throw new NotFoundException('Part not found');
    }

    if (part.stockQuantity < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already in cart
    const existingCartItem = await this.cartRepository.findOne({
      where: { userId, partId: addToCartDto.partId },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + addToCartDto.quantity;
      if (part.stockQuantity < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }
      existingCartItem.quantity = newQuantity;
      existingCartItem.updatedBy = userId;
      return this.cartRepository.save(existingCartItem);
    }

    const cartItem = this.cartRepository.create({
      userId,
      partId: addToCartDto.partId,
      quantity: addToCartDto.quantity,
      createdBy: userId,
    });

    return this.cartRepository.save(cartItem);
  }

  async getCart(userId: string) {
    return this.cartRepository.find({
      where: { userId },
      relations: ['part', 'part.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateQuantity(userId: string, cartId: string, quantity: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartId, userId },
      relations: ['part'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.part.stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = quantity;
    cartItem.updatedBy = userId;
    return this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: string, cartId: string) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(cartItem);
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    await this.cartRepository.delete({ userId });
    return { message: 'Cart cleared' };
  }
}