import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class MessagesService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  async postMessage(uid: string, content: string) {
    const messageRef = this.firestore
      .collection('messages')
      .doc(uid)
      .collection('userMessages');
    const newMessage = {
      content,
      createdAt: new Date().toISOString(),
    };
    await messageRef.add(newMessage);
    return newMessage;
  }

  async getMessages(uid: string) {
    const snapshot = await this.firestore
      .collection('messages')
      .doc(uid)
      .collection('userMessages')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => doc.data());
  }
}
