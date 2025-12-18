import { IsUUID, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateServiceRequestDto {
  @IsUUID()
  providerId: string;

  @IsUUID()
  vehicleId: string;

  @IsUUID()
  serviceId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  estimatedPrice?: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}