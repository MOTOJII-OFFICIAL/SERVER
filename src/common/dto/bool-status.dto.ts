import { IsBoolean } from 'class-validator';

export class BoolStatusDto {
  @IsBoolean()
  status: boolean;
}