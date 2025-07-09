import { Controller, Get, Patch, Req, Body, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { UpdateUserDto } from './dto/update-user-dto';

// Extend Express Request interface to include 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

interface AuthUser {
  uid: string;
  email: string;
  name?: string;
}

@Controller('user')
export class UserController {
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const user = req.user as AuthUser;
    return {
      uid: user.uid,
      email: user.email,
      name: user.name ?? null,
    };
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('me')
  updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    const user = req.user as AuthUser;

    return {
      uid: user.uid,
      email: user.email,
      name: body.name,
    };
  }
}
