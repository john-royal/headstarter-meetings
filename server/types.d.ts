import { IUser } from './User';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string;
      PORT: number;
      MONGODB_URI: string;
      SESSION_SECRET: string;
      ZOOM_CLIENT_ID: string;
      ZOOM_CLIENT_SECRET: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: IUser | null;
    state?: string;
  }
}
