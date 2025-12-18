import { IsUUID } from 'class-validator';

export class CreateServiceVehicleCategoryDto {
  @IsUUID()
  serviceId: string;

  @IsUUID()
  vehicleCategoryId: string;
}