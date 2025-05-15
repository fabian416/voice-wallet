import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CredentialService } from '../credential.service';

@Injectable()
export class CredentialGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const credentialService = new CredentialService();
    const isValid = credentialService.verifyCredential(token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
