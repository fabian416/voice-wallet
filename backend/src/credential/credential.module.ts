import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { CredentialGuard } from './guards/credential.guard';

@Module({
    imports: [],
    providers: [CredentialService, CredentialGuard],
    controllers: [CredentialController],
    exports: [CredentialService, CredentialGuard],

})
export class CredentialModule {}
