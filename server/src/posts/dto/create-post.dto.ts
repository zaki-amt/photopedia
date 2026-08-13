import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  tags?: string | string[];

  @IsOptional()
  @IsString()
  camera?: string;

  @IsOptional()
  @IsString()
  lens?: string;

  @IsOptional()
  @IsString()
  aperture?: string;

  @IsOptional()
  @IsString()
  shutter?: string;

  @IsOptional()
  @IsString()
  iso?: string;
}
