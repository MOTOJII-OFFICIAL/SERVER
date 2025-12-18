import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRole, OnboardingStatus } from 'src/enum';
import { Account } from 'src/account/entities/account.entity';
import { OnboardingTrackingService } from './onboarding-tracking.service';
import { ApproveUserDto } from './dto/approve-user.dto';
import { RejectUserDto } from './dto/reject-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetUsersByStatusDto } from './dto/get-users-by-status.dto';

@Controller('onboarding-tracking')
@UseGuards(AuthGuard('jwt'))
export class OnboardingTrackingController {
  constructor(private readonly onboardingService: OnboardingTrackingService) {}
  
  @Get('admin/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getUsersByStatus(@Query() query: GetUsersByStatusDto) {
    return this.onboardingService.getUsersByStatus(query);
  }

  @Get('admin/user/:accountId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getUserOnboardingDetails(@Param('accountId') accountId: string) {
    return this.onboardingService.getUserOnboardingDetails(accountId);
  }

  @Patch('admin/approve/:accountId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  approveUser(
    @Param('accountId') accountId: string,
    @Body() approveDto: ApproveUserDto,
    @CurrentUser() admin: Account
  ) {
    return this.onboardingService.approveUser(accountId, admin.id, approveDto.remark);
  }

  @Patch('admin/reject/:accountId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  rejectUser(
    @Param('accountId') accountId: string,
    @Body() rejectDto: RejectUserDto,
    @CurrentUser() admin: Account
  ) {
    return this.onboardingService.rejectUser(accountId, admin.id, rejectDto.remark);
  }

  // Service provider endpoints
  @Get('my-status')
  getMyOnboardingStatus(@CurrentUser() user: Account) {
    return this.onboardingService.getMyOnboardingStatus(user.id);
  }

  @Post('check-documents')
  checkDocumentStatus(@CurrentUser() user: Account) {
    return this.onboardingService.checkAndUpdateDocumentStatus(user.id);
  }
}