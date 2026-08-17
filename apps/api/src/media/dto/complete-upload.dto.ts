import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CompleteUploadDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  mimetype?: string;
}
