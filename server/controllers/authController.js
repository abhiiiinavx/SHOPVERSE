import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { generateToken, generateResetToken, sendResponse, sendError } from '../utils/helpers.js';
import sendEmail from '../config/email.js';

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User already exists with that email');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, 201, true, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  sendResponse(res, 200, true, 'Logout successful');
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    const { token, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `Click here to reset your password: ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    sendResponse(res, 200, true, 'Reset link sent to your email');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return sendError(res, 400, 'Passwords do not match');
    }

    const hashedToken = require('crypto').createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendResponse(res, 200, true, 'Password reset successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    sendResponse(res, 200, true, 'User fetched successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
