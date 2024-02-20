export interface CustomWsRequest {
  token?: string;
  args: Record<string, string>[];
}

export interface CustomWsResponse<T> {
  event: string;
  msg: string;
  code: string;
  data?: T;
}

export interface OkxWsResponse {
  event?: string;
  arg: Record<string, string>;
  data: Record<string, string>;
}

export interface DecodedJwt {
  email: string;
  iat: number;
  exp: number;
}

export interface ApiConfiguration {
  secretKey: string;
  apiKey: string;
  passphrase: string;
}

export type MethodTypes = "GET" | "POST";
