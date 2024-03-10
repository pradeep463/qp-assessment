// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send({
    status: false,
    statusCode: 500,
    message: "Something went wrong!!!",
    error: {},
  });
};
