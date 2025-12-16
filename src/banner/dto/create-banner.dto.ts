import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { DefaultStatus } from 'src/enum';

export class BannerDto {
  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}

export class BannerPaginationDto {
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

export class CreateBannerDto extends BannerDto {}