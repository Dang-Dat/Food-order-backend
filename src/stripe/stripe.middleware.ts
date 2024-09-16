import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StripeRawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.startsWith('/api/order/checkout/webhook')) {
      req.rawBody = req.body;
    }
    next();
  }
}
