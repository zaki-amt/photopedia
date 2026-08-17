import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  category?: string;

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
