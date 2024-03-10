// src/middleware/logger.ts
import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.info(`${req.method} ${req.path} ${new Date()}`);
  next();
};

