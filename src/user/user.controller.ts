import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {UserCreateDto} from "./dto/user.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('list')
  async grtUserList() {
    return this.userService.getAllUsers();
  }
  @Post('account/create')
  async createUserAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }
  @Post('account/:userId/animal')
  async addAnimalToUser() {
    return 'New User';
  }
  @Delete(':userId')
  async deleteUserAccount() {}
  @Patch(':userId')
  async updateUserProfile() {}

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    return this.userService.getOneUserAccount(userId);
  }
}
