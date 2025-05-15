import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDidLinkedResourceDto {
  @IsNotEmpty()
  @IsString()
  did: string;

  @IsNotEmpty()
  @IsString()
  embeddingBase64Url: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  version: string;
}
