import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserMessage {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    veridaAuthToken?: string;
}