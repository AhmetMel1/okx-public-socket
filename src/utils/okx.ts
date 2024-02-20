import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";
import { WebSocket } from "ws";
import { ApiConfiguration, MethodTypes } from "./abstract";

@Injectable()
export class OkxService {
  _init(): void {}

  async sendOkxWsRequest<T>(
    socket: WebSocket,
    operation: string,
    args: T[]
  ): Promise<void> {
    socket.send(
      JSON.stringify({
        op: operation,
        args: args,
      })
    );
  }

  generateSignature(secretKey: string, timestamp: number): string {
    const hashed = Buffer.from(
      timestamp + "GET" + "/users/self/verify",
      "utf-8"
    );

    const secretKeyBytes = Buffer.from(secretKey, "utf-8");
    const hmac = createHmac("sha256", secretKeyBytes);
    hmac.update(hashed);
    const finalize = hmac.digest();

    return finalize.toString("base64");
  }

  generateHeaders() {
    const headers = new Headers();
    const timestamp = new Date().getTime() / 1000;

    const signature = this.generateSignature(
      process.env.OKX_BROKER_SECRET_KEY,
      timestamp
    );

    headers.append("OK-ACCESS-KEY", process.env.OKX_BROKER_API_KEY);
    headers.append("OK-ACCESS-SIGN", signature);
    headers.append("OK-ACCESS-TIMESTAMP", timestamp.toString());
    headers.append("OK-ACCESS-PASSPHRASE", process.env.OKX_BROKER_PASSPHRASE);
    return headers;
  }
}
