import User from '../models/User.js';
import { sendResponse, sendError } from '../utils/helpers.js';
import cloudinary from '../config/cloudinary.js';

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendResponse(res, 200, true, 'User profile fetched successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, true, 'Profile updated successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No file uploaded');
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'shopverse/avatars',
    });

    const user = await User.findById(req.user.id);
    user.avatar = result.secure_url;
    await user.save();

    sendResponse(res, 200, true, 'Avatar uploaded successfully', { avatar: result.secure_url });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
    });
    await user.save();

    sendResponse(res, 200, true, 'Address added successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    const address = user.addresses.id(addressId);

    if (!address) {
      return sendError(res, 404, 'Address not found');
    }

    Object.assign(address, { street, city, state, zipCode, country, isDefault });
    await user.save();

    sendResponse(res, 200, true, 'Address updated successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    sendResponse(res, 200, true, 'Address deleted successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized');
    }

    const users = await User.find({}).sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Users fetched successfully', users);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Not authorized');
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendResponse(res, 200, true, 'User fetched successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
};
