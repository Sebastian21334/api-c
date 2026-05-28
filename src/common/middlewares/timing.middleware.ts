import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startAt = Date.now();

    const originalSend = res.send.bind(res);

    res.send = function (body: any) {
      const ms = Date.now() - startAt;
      res.setHeader('X-Response-Time', `${ms} ms`);
      return originalSend(body);
    };

    next();
  }
}