import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveUserDto {
  @IsString()
  @IsNotEmpty()
  remark: string;
}