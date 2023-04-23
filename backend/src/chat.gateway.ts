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
  id: number;
  message: { text: string; status: string };
  user: {
    id: string;
    name: string;
    avatar: string;
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
    };

    delete this.connectedUsers[client.id];
    this.server.emit('usersOnline', this.connectedUsers);
    this.server.emit('message', disconnectData);
    // console.log('this.connectedUsers', this.connectedUsers);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() messageData: IMessageData): void {
    this.server.emit('message', messageData);
    console.log('message data', messageData);
    const clientId = messageData.user.id;
    const clientName = messageData.user.name;
    console.log('this.connectedUsers[clientId]', this.connectedUsers[clientId]);
    this.connectedUsers[clientId] = { name: clientName };
    console.log('this.connectedUsers', this.connectedUsers);
  }

  @SubscribeMessage('userConnected')
  handleUserConnected(@MessageBody() userData): void {
    console.log('userData', userData);
    this.connectedUsers[userData.id] = { name: userData.name };
    console.log('this.connectedUsers', this.connectedUsers);
    this.server.emit('usersOnline', this.connectedUsers);
  }
}
