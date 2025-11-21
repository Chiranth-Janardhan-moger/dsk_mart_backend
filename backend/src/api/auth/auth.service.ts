import crypto from 'crypto';
import { User } from '../../models/User';
import { DeliveryBoy } from '../../models/DeliveryBoy';
import { generateToken, verifyToken } from '../../utils/jwt';
import { UnauthorizedError, ValidationError } from '../../utils/errors';

class AuthService {
  async register(data: any) {
    const { name, email, phone, password, role } = data;

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    const user = await User.create({ name, email, phone, password, role });

    if (role === 'delivery_boy') {
      await DeliveryBoy.create({
        userId: user._id,
        vehicleType: 'bike',
        vehicleNumber: 'N/A',
        licenseNumber: 'N/A',
      });
    }

    const token = generateToken({ userId: user._id.toString(), role: user.role });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(emailOrPhone: string, password: string) {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      isActive: true,
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({ userId: user._id.toString(), role: user.role });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('Invalid token');
      }

      const newToken = generateToken({ userId: user._id.toString(), role: user.role });
      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedError('Token refresh failed');
    }
  }

  async forgotPassword(data: { email?: string; phone?: string }) {
    const { email, phone } = data;

    if (!email && !phone) {
      throw new ValidationError('Email or phone is required');
    }

    const user = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (!user) {
      // Do not reveal whether the user exists
      return {
        message: 'If an account exists for the provided details, a reset token has been generated',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    return {
      message: 'Password reset token generated',
      resetToken,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;
    await user.save();
  }
}

export const authService = new AuthService();
