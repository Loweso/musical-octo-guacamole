import { IsString, MaxLength, MinLength } from 'class-validator';

export class MessageDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(1)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MaxLength(50)
  content: string;
}
