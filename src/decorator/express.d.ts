import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      rawBody?: string; // Thêm thuộc tính rawBody vào kiểu Request
    }
  }
}