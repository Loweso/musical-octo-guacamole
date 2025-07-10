import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [UserModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
