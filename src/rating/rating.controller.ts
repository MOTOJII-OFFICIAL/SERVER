import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateRatingDto) {
    return this.ratingService.create(req.user.id, createDto);
  }

  @Get('provider/:providerId')
  findProviderRatings(@Param('providerId') providerId: string) {
    return this.ratingService.findProviderRatings(providerId);
  }

  @Get('my-ratings')
  findMyRatings(@Request() req) {
    return this.ratingService.findUserRatings(req.user.id);
  }
}