import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductRatingService } from './product-rating.service';
import { CreateProductRatingDto } from './dto/create-product-rating.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product-ratings')
export class ProductRatingController {
  constructor(private readonly ratingService: ProductRatingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Request() req, @Body() createDto: CreateProductRatingDto) {
    return this.ratingService.create(req.user.id, createDto);
  }

  @Get('product/:productId')
  findProductRatings(@Param('productId') productId: string) {
    return this.ratingService.findProductRatings(productId);
  }

  @Get('product/:productId/stats')
  getProductRatingStats(@Param('productId') productId: string) {
    return this.ratingService.getProductRatingStats(productId);
  }
}