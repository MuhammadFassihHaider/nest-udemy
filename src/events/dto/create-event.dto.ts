import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(3, 30, { message: 'This is a custom message' })
  name: string;

  @Length(3, 60)
  description: string;

  @IsDateString()
  when: string;

  @Length(3, 60)
  address: string;
}
