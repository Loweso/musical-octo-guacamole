import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import admin from '../firebase/firebase-admin';
import { Request } from 'express';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken: admin.auth.DecodedIdToken = await admin
        .auth()
        .verifyIdToken(token);
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email ?? '',
        name: (decodedToken.name as string | undefined) ?? '',
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
