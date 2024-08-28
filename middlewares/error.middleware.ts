import { Request, Response, NextFunction } from "express";

type Props = {
  req: any;
  res: Response;
  next: NextFunction;
  error: Error;
}

type Controller = (req: any, res: Response, next: NextFunction) => Promise<void>;

const pageNotFound = ({req, res, next}: Props) => {
  const error =  new Error(`Not found - ${req.originalUrl}`);
  res.status(400);
  next(error);
};

const errorHandler = ({error, req, res, next}: Props) => {
  const statusCode = res.statusCode=== 200 ? 500 : res.statusCode;

  console.error({
    message: error.message,
    stack: error.stack,
  });

  res.status(statusCode).send({ message: error.message});
};

const asyncHandler = (controller: Controller) => {
  return async ({req, res, next}: Props) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export { errorHandler, pageNotFound, asyncHandler };
