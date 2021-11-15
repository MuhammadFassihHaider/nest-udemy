import { Request } from '@nestjs/common';
import { User } from '../entities/user.entity';

interface UserRequest extends Request {
  user: User;
}
