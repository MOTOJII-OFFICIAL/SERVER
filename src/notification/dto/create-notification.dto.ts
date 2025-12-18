import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsString()
  title: string;

  @IsString()
  message: string;
}

export class BroadcastNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;
}
