import { Request } from '@nestjs/common';
import { User } from '../entities/user.entity';

export interface UserRequest extends Request {
  user: User;
}
