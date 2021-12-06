import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getTokenForUser(user: User) {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async registerNewUser(createAuthDto: CreateAuthDto) {
    const user = new User();
    const { email, username, name, password } = createAuthDto;
    const isUserAlreadyPresent = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .where('username = :username', { username })
      .orWhere('email = :email', { email })
      .getCount();
    if (isUserAlreadyPresent) {
      throw new BadRequestException(['User already exists!']);
    }

    user.email = email;
    user.name = name;
    user.password = await this.hashPassword(password);
    user.username = username;

    const response = await this.userRepository.save(user);
    delete response.password;

    return {
      user: {
        ...response,
      },
      token: this.getTokenForUser(user),
    };
  }
}
