import { ObjectId } from "mongodb";

export interface RefreshTokenDB {
    _id?: ObjectId;
    id: string;
    token: string;
    userId: string;
    userEmail: string;
    issuedAt: number;
    expiresAt: number;
    lastUsed?: number;
    deviceInfo?: {
      ip: string;
      userAgent: string;
    };
  }