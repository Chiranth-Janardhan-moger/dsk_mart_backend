import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ValidationError } from '../utils/errors';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return next(new ValidationError(error.message));
    }

    // eslint-disable-next-line no-param-reassign
    (req as any).validatedBody = value;
    next();
  };
};

