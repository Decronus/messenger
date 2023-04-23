import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface IMessageData {
  data: {
    id: number;
    message: { text: string; status: string };
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // this.connectedUsers[client.id] = { name: '' };
    // console.log('this.connectedUsers', this.connectedUsers);
    // this.server.emit('usersOnline', this.connectedUsers);
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    const disconnectData: IMessageData = {
      data: {
        id: Date.now(),
        message: {
          text: `${this.connectedUsers[client.id].name} вышел`,
          status: 'leaveMessage',
        },
        user: {
          id: client.id,
          name: this.connectedUsers[client.id].name,
          avatar: '',
        },
      },
    };
    this.server.emit('message', disconnectData);
    delete this.connectedUsers[client.id];
    // console.log('this.connectedUsers', this.connectedUsers);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() messageData: IMessageData): void {
    this.server.emit('message', messageData);
    console.log(messageData);
    const clientId = messageData.data.user.id;
    const clientName = messageData.data.user.name;
    this.connectedUsers[clientId].name = clientName;
    // console.log('this.connectedUsers', this.connectedUsers);
  }

  @SubscribeMessage('userConnected')
  handleUserConnected(@MessageBody() userData): void {
    this.connectedUsers[userData.id] = { name: userData.name };
    console.log('this.connectedUsers', this.connectedUsers);
    this.server.emit('usersOnline', this.connectedUsers);
  }
}
