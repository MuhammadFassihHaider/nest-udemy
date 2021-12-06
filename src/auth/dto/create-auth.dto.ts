import { IsAlphanumeric, IsEmail, Min, MinLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class CreateAuthDto {
  @IsAlphanumeric()
  @MinLength(3)
  username: string;

  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;

  @MinLength(3)
  name: string;

  @Match('password')
  @MinLength(6)
  retypePassword: string;
}
