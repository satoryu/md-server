import type { RequestHandler } from 'express';

export function requestLogger(): RequestHandler {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] INFO ${req.method} ${req.path} ${res.statusCode} ${elapsed}ms`);
    });

    next();
  };
}
