import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserAddressDto } from 'src/address/dto/create-user-address.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from './entities/account.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('account')
@UseGuards(AuthGuard('jwt'))
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.accountService.getUsers(query);
  }

  @Get('profile')
  getMyProfile(@CurrentUser() user: Account) {
    return this.accountService.getProfileById(user.id);
  }

  @Get('profile/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getProfileById(@Param('id') id: string) {
    return this.accountService.getProfileById(id);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: Account, @Body() updateProfileDto: UpdateProfileDto) {
    return this.accountService.updateProfile(user.id, updateProfileDto);
  }

  @Post('address')
  addAddress(@CurrentUser() user: Account, @Body() createAddressDto: CreateUserAddressDto) {
    return this.accountService.addUserAddress(user.id, createAddressDto);
  }

  @Put('update-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Profile',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  updateImage(
    @CurrentUser() user: Account,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.accountService.updateImage(user.id, file.path);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.accountService.deleteUser(id, user.id);
  }

  @Patch('status/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @CurrentUser() user: Account
  ) {
    return this.accountService.updateUserStatus(id, updateStatusDto, user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete('remove/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
