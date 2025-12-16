import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsUUID, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { DefaultStatus, AddressType } from 'src/enum';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  streetName: string;

  @IsNotEmpty()
  @IsString()
  houseNo: string;

  @IsNotEmpty()
  @IsString()
  pinCode: string;

  @IsOptional()
  @IsString()
  landmark: string;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsUUID()
  countryId: string;

  @IsNotEmpty()
  @IsUUID()
  stateId: string;

  @IsNotEmpty()
  @IsUUID()
  cityId: string;

  @IsOptional()
  @IsEnum(AddressType)
  addressType: AddressType;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}

export class AddressPaginationDto {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  countryId: string;

  @IsOptional()
  @IsUUID()
  stateId: string;

  @IsOptional()
  @IsUUID()
  cityId: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number = 0;
}

export class CreateAddressDto extends AddressDto {}