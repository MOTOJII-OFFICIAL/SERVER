import { IsString, IsOptional, IsNumber, IsUUID, Length, IsEnum } from 'class-validator';
import { AddressType } from 'src/enum';

export class CreateUserAddressDto {
  @IsString()
  @Length(1, 100)
  streetName: string;

  @IsString()
  @Length(1, 50)
  houseNo: string;

  @IsString()
  @Length(1, 10)
  pinCode: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  landmark: string;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;

  @IsUUID()
  countryId: string;

  @IsUUID()
  stateId: string;

  @IsUUID()
  cityId: string;

  @IsOptional()
  @IsEnum(AddressType)
  addressType: AddressType;
}