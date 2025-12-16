import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CarDetailerDetailsDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  panNo: string;
}

export class UpdateCarDetailerDetailsDto {
  @IsOptional()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  panNo: string;
}