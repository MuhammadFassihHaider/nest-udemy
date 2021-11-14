import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getTokenForUser(user: User) {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }
}
