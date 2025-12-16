import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DefaultStatus } from 'src/enum';

export class CityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsUUID()
  stateId: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}

export class CityPaginationDto {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsUUID()
  stateId: string;

  @IsOptional()
  @IsUUID()
  countryId: string;

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

export class CreateCityDto extends CityDto {}