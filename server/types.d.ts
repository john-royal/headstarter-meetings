import { IUser } from './User';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string;
      PORT: number;
      MONGODB_URI: string;
      SESSION_SECRET: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: IUser | null;
  }
}
