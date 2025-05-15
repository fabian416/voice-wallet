import { IsNotEmpty, IsString } from 'class-validator';

export class GetDidLinkedResourceDto {
  @IsNotEmpty()
  @IsString()
  did: string;

  @IsNotEmpty()
  @IsString()
  resourceId: string;
}
