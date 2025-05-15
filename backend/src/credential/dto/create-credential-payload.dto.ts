import { IsString } from 'class-validator';

export class CreateCredentialPayloadDto {
  @IsString()
  subjectDid: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  email: string;

  @IsString()
  voiceprint: string;
}