/**
 *JWT Config
 */
export const JWT_CONFIG = {
  secretKey: process.env.JWT_SECRET_KEY || 'TEST',
  expiresIn: process.env.JWT_SECRET_KEY_EXPIRE_IN || '8h',
};
