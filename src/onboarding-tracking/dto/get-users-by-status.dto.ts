import { IsOptional, IsEnum } from 'class-validator';
import { OnboardingStatus } from 'src/enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetUsersByStatusDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OnboardingStatus)
  status?: OnboardingStatus;
}