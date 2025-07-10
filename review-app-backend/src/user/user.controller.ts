import { Controller, Get, Patch, Req, Body, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { UpdateUserDto } from './dto/update-user-dto';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const firestore = admin.firestore();

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
  async getMe(@Req() req: Request) {
    const user = req.user as AuthUser;

    const docSnap = await firestore.collection('users').doc(user.uid).get();
    const data = docSnap.exists ? (docSnap.data() as { name?: string }) : {};

    return {
      uid: user.uid,
      email: user.email,
      name: data?.name ?? null,
    };
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    const user = req.user as AuthUser;

    await firestore.collection('users').doc(user.uid).set(
      {
        name: body.name,
        email: user.email,
      },
      { merge: true },
    );

    return {
      uid: user.uid,
      email: user.email,
      name: body.name,
    };
  }
}
