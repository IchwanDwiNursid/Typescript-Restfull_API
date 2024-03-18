import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/error-response";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: `Validation Error : ${JSON.stringify(error)}`,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.field).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: "Internal Server Error",
    });
  }
};
