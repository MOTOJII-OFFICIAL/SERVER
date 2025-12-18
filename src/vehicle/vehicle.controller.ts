import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
@UseGuards(AuthGuard('jwt'))
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // CREATE
  @Post()
  create(@CurrentUser() user: Account, @Body() createDto: CreateVehicleDto) {
    return this.vehicleService.create(user.id, createDto);
  }

  // READ
  @Get()
  findUserVehicles(@CurrentUser() user: Account) {
    return this.vehicleService.findUserVehicles(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.vehicleService.findOne(id, user.id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: Account,
    @Body() updateDto: UpdateVehicleDto
  ) {
    return this.vehicleService.update(id, user.id, updateDto);
  }

  @Patch('set-default/:id')
  setDefault(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.vehicleService.setDefault(id, user.id);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.vehicleService.remove(id, user.id);
  }
}