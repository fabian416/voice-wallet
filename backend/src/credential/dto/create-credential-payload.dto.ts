import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class VoiceprintDto {
  @IsString()
  resourceType: string;

  @IsString()
  voiceResourceURI: string;

  @IsString()
  resourceName: string;

  @IsString()
  resourceVersion: string;

  @IsString()
  mediaType: string;
}


export class CreateCredentialPayloadDto {
  @IsString()
  signer: string;

  @IsString()
  subjectDid: string;

  @ValidateNested()
  @Type(() => VoiceprintDto)
  voiceprint: VoiceprintDto;
}