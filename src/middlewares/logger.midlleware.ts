//Remember that if you are using a local middleWare it has got to be injectable, if it is global it has to be a regular one
const dayjs = require('dayjs');
import { NextFunction, Request, Response } from 'express';

export const globalMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const time = dayjs().format('HH:mm');
  const date = dayjs().format('MM-DD-YYYY ');
  console.log(
    `You are executing a method ${req.method} in route ${req.url} on ${date}at ${time} `,
  );
  next();
};
