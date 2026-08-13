import { IsOptional, IsString } from 'class-validator';

export class FlagPostDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
