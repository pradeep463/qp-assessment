import { Request, Response } from "express";

export function test(req: Request, res: Response) {
  res.json("test");
}
