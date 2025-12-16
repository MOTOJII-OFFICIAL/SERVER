import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class TowingProviderDetailsDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  panNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  licenceNo: string;
}

export class UpdateTowingProviderDetailsDto {
  @IsOptional()
  @IsString()
  @Length(12, 12)
  aadharNo: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  panNo: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  licenceNo: string;
}