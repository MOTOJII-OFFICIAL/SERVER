import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class VendorDetailsDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(15, 15)
  gstNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  panNo: string;
}

export class UpdateVendorDetailsDto {
  @IsOptional()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsOptional()
  @IsString()
  @Length(15, 15)
  gstNo: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  panNo: string;
}