import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { StreamsModule } from './streams/streams.module';
import { UsersModule } from './users/users.module';

import { SignalingGateway } from './signaling/signaling.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGO_URI!,
    ),

    AuthModule,
    StreamsModule,
    UsersModule,
  ],

  controllers: [AppController],

  providers: [SignalingGateway],
})
export class AppModule {}