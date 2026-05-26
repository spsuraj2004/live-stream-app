import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SignalingGateway {
  @WebSocketServer()
  server: Server;

  // JOIN ROOM
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);

    console.log(
      `Client joined room: ${roomId}`,
    );
  }

  // OFFER
  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit(
      'offer',
      data.offer,
    );
  }

  // ANSWER
  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit(
      'answer',
      data.answer,
    );
  }

  // ICE CANDIDATE
  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit(
      'ice-candidate',
      data.candidate,
    );
  }

  // LIVE CHAT
  @SubscribeMessage('chat-message')
  handleChatMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(data.roomId)
      .emit('chat-message', data);
  }

  // STREAM ENDED
  @SubscribeMessage('stream-ended')
  handleStreamEnded(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client
      .to(roomId)
      .emit('stream-ended');

    console.log(
      `Stream ended in room: ${roomId}`,
    );
  }
}