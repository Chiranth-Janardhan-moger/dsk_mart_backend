import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export const context = async ({ req }: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return {};

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    return { user };
  } catch {
    return {};
  }
};