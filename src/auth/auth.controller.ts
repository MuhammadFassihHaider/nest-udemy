import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('my strategy'))
  async login(@CurrentUser() user: User) {
    const token = this.authService.getTokenForUser(user);
    return {
      user: user.id,
      token: token,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt-strategy'))
  async profile(@CurrentUser() user: User) {
    return user;
  }

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    return await this.authService.registerNewUser(createAuthDto);
  }
}
