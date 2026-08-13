import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateModerationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['APPROVED', 'REMOVED'])
  status: 'APPROVED' | 'REMOVED';
}
