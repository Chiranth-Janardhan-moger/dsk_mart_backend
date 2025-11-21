import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../utils/validators';
import { ValidationError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) throw new ValidationError(error.message);

      const result = await authService.register(value);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) throw new ValidationError(error.message);

      const result = await authService.login(value.emailOrPhone, value.password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await authService.refreshToken(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = forgotPasswordSchema.validate(req.body);
      if (error) throw new ValidationError(error.message);

      const result = await authService.forgotPassword(value);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = resetPasswordSchema.validate(req.body);
      if (error) throw new ValidationError(error.message);

      await authService.resetPassword(value.token, value.password);
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();