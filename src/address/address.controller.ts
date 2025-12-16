import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto, AddressPaginationDto } from './dto/create-address.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRole } from 'src/enum';
import { Account } from 'src/account/entities/account.entity';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@CurrentUser() account: Account, @Body() dto: AddressDto) {
    return this.addressService.create(account.id, dto);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() dto: AddressPaginationDto) {
    return this.addressService.findAll(dto);
  }

  @Get('my-addresses')
  @UseGuards(AuthGuard('jwt'))
  findMyAddresses(@CurrentUser() account: Account, @Query() dto: AddressPaginationDto) {
    return this.addressService.findByAccount(account.id, dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @CurrentUser() account: Account, @Body() dto: AddressDto) {
    return this.addressService.update(id, account.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @CurrentUser() account: Account) {
    return this.addressService.remove(id, account.id);
  }
}