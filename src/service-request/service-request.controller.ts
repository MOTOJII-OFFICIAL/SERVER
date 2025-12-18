import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { SearchProvidersDto } from './dto/search-providers.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('service-requests')
@UseGuards(JwtAuthGuard)
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateServiceRequestDto) {
    return this.serviceRequestService.create(req.user.id, createDto);
  }

  @Get('nearby-providers')
  findNearbyProviders(@Query() searchDto: SearchProvidersDto) {
    return this.serviceRequestService.findNearbyProviders(
      searchDto.lat,
      searchDto.lng,
      searchDto.radius,
      searchDto.role,
    );
  }

  @Get('my-requests')
  findMyRequests(@Request() req) {
    return this.serviceRequestService.findUserRequests(req.user.id);
  }

  @Get('provider-requests')
  findProviderRequests(@Request() req) {
    return this.serviceRequestService.findProviderRequests(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceRequestDto) {
    return this.serviceRequestService.update(id, updateDto);
  }

  @Patch('accept/:id')
  acceptRequest(@Request() req, @Param('id') id: string) {
    return this.serviceRequestService.acceptRequest(req.user.id, id);
  }

  @Patch('reject/:id')
  rejectRequest(@Request() req, @Param('id') id: string) {
    return this.serviceRequestService.rejectRequest(req.user.id, id);
  }

  @Get('provider-stats')
  getProviderStats(@Request() req) {
    return this.serviceRequestService.getProviderStats(req.user.id);
  }
}