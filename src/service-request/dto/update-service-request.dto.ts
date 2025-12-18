import { IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { RequestStatus } from 'src/enum';

export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  requestStatus?: RequestStatus;

  @IsOptional()
  @IsNumber()
  finalPrice?: number;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}