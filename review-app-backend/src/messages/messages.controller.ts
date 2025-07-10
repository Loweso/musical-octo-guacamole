import {
  Controller,
  Patch,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { MessageDto } from './dto/messages.dto';
import { Request } from 'express';
import * as admin from 'firebase-admin';

interface AuthUser {
  uid: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

if (!admin.apps.length) {
  admin.initializeApp();
}
const firestore = admin.firestore();

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async addMessage(@Req() req: Request, @Body() body: MessageDto) {
    const user = req.user as AuthUser;
    const messageRef = firestore
      .collection('userMessages')
      .doc(user.uid)
      .collection('messages')
      .doc();

    const message = {
      id: messageRef.id,
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    await messageRef.set(message);
    return message;
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getMessages(@Req() req: Request) {
    const user = req.user as AuthUser;

    const snapshot = await firestore
      .collection('userMessages')
      .doc(user.uid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();

    const messages = snapshot.docs.map((doc) => doc.data() as Message);
    return messages;
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async updateMessage(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: MessageDto,
  ) {
    const user = req.user as AuthUser;
    const messageRef = firestore
      .collection('userMessages')
      .doc(user.uid)
      .collection('messages')
      .doc(id);

    const doc = await messageRef.get();
    if (!doc.exists) {
      throw new Error('Message not found');
    }

    const updated = {
      content: body.content,
      updatedAt: new Date().toISOString(),
    };

    await messageRef.update(updated);
    return { id, ...updated };
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async deleteMessage(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;

    const messageRef = firestore
      .collection('userMessages')
      .doc(user.uid)
      .collection('messages')
      .doc(id);

    const doc = await messageRef.get();
    if (!doc.exists) {
      return { success: false, message: 'Message not found' };
    }

    await messageRef.delete();
    return { success: true, message: 'Message deleted' };
  }
}
