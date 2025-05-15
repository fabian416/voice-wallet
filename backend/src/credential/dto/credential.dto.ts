import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IssuerDto {
  @IsString()
  id: string;
}

export class CredentialSubjectDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  email: string;

  @IsString()
  voiceprint: string;
}

export class CredentialStatusDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsString()
  statusPurpose: string;

  @IsString()
  statusListIndex: string;
}

export class ProofDto {
  @IsString()
  type: string;

  @IsString()
  jwt: string;
}

export class CredentialDto {
  @IsArray()
  @IsString({ each: true })
  '@context': string[];

  @IsArray()
  @IsString({ each: true })
  type: string[];

  @ValidateNested()
  @Type(() => IssuerDto)
  issuer: IssuerDto;

  @IsString()
  issuanceDate: string;

  @ValidateNested()
  @Type(() => CredentialSubjectDto)
  credentialSubject: CredentialSubjectDto;

  @ValidateNested()
  @Type(() => CredentialStatusDto)
  credentialStatus: CredentialStatusDto;

  @ValidateNested()
  @Type(() => ProofDto)
  proof: ProofDto;
}