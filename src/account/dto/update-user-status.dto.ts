import { IsEnum } from 'class-validator';
import { DefaultStatus } from 'src/enum';

export class UpdateUserStatusDto {
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}