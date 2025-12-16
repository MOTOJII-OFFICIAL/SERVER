import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateUserAdditionalDetailDto {
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

  @IsOptional()
  @IsString()
  @Length(1, 30)
  licenceNo: string;
}