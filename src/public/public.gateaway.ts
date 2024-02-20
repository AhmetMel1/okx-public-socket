import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";

import { Server, WebSocket } from "ws";
import { WebSocketType } from "src/utils/enums";
import { CustomWsRequest } from "src/utils/abstract";
import { OkxService } from "src/utils/okx";
import { CustomResponse } from "src/utils/response";

@WebSocketGateway({ path: WebSocketType.PUBLIC })
export class PublicGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private okxSocket: WebSocket;
  private pingInterval = null;

  constructor(private readonly okxService: OkxService) {
    okxService._init();
    this.connectToOkxWebSocket();
  }

  async handleConnection(): Promise<void> {
    console.log("connected");

    if (!this.okxSocket || this.okxSocket.readyState !== WebSocket.OPEN) {
      this.connectToOkxWebSocket();
    }
  }
  async handleDisconnect(): Promise<void> {
    console.log("connection finished");

    if (this.okxSocket || this.okxSocket.readyState === WebSocket.OPEN) {
      this.okxSocket.close();
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  @SubscribeMessage("subscribe")
  async handleMessage(@MessageBody() body: CustomWsRequest): Promise<void> {
    this.okxService.sendOkxWsRequest(this.okxSocket, "subscribe", body.args);
  }

  connectToOkxWebSocket(): void {
    this.okxSocket = new WebSocket("wss://wspri.okx.com:8443/ws/v5/ipublic");
    this.okxSocket.onopen = () => {};

    this.okxSocket.onmessage = (event) => {
      if (event.data.toString() != "pong") {
        const res = JSON.parse(event.data.toString());

        const response = new CustomResponse();

        this.server.clients.forEach(async (client) => {
          if (res?.data || res.event === "subscribe") {
            client.send(
              JSON.stringify(response.success(res.arg.channel, res.data))
            );
          } else {
            client.send(
              JSON.stringify(response.error("error", res.msg, res.code))
            );
          }
        });
      }
    };

    this.pingInterval = setInterval(() => {
      this.okxSocket.send("ping");
    }, 1000 * 20);
  }
}
