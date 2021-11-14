import { Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRequest } from './dto/types';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('my strategy'))
  async login(@Req() request: UserRequest) {
    const { user } = request;
    const token = this.authService.getTokenForUser(user);
    return {
      user: user.id,
      token: token,
    };
  }
}
