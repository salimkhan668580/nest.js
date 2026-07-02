import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("totalUsers")
  handleTotalUsers(): string {
    const totalUsers = this.server.engine.clientsCount;
    this.server.emit("totalUsers", totalUsers);
    return totalUsers.toString();
  }
  @SubscribeMessage("message")
  handleMessage(client: Socket, payload: string): string {
    return client.id + " : " + payload;
  }
}
