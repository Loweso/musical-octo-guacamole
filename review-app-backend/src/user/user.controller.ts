import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

declare module 'express' {
  interface Request {
    user?: { uid: string; email: string; name?: string };
  }
}

@Controller('user')
export class UserController {
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getMe(@Req() req: import('express').Request) {
    return {
      uid: (req.user as { uid: string; email: string; name?: string }).uid,
      email: (req.user as { uid: string; email: string; name?: string }).email,
      name:
        (req.user as { uid: string; email: string; name?: string }).name ||
        null,
    };
  }
}
