import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class MechanicDetailsDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsOptional()
  @IsString()
  @Length(15, 15)
  gstNo: string;
}

export class UpdateMechanicDetailsDto {
  @IsOptional()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsOptional()
  @IsString()
  @Length(15, 15)
  gstNo: string;
}