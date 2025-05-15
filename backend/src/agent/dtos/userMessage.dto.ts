import { IsNotEmpty, IsString } from "class-validator";

export class UserMessage {
    @IsString()
    @IsNotEmpty()
    message: string;
}