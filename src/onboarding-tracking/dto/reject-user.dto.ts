import { IsString, IsNotEmpty } from 'class-validator';

export class RejectUserDto {
  @IsString()
  @IsNotEmpty()
  remark: string;
}