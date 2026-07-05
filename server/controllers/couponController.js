import Coupon from '../models/Coupon.js';
import { sendResponse, sendError } from '../utils/helpers.js';

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    sendResponse(res, 200, true, 'Coupons fetched successfully', coupons);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found or expired');
    }

    if (new Date() > coupon.validTill) {
      return sendError(res, 400, 'Coupon has expired');
    }

    if (totalAmount < coupon.minPurchaseAmount) {
      return sendError(
        res,
        400,
        `Minimum purchase amount of Rs. ${coupon.minPurchaseAmount} required`
      );
    }

    if (coupon.maxUsageCount && coupon.currentUsageCount >= coupon.maxUsageCount) {
      return sendError(res, 400, 'Coupon usage limit exceeded');
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (totalAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    sendResponse(res, 200, true, 'Coupon is valid', {
      coupon,
      discount,
      finalAmount: totalAmount - discount,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountValue, discountType, validTill } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return sendError(res, 400, 'Coupon already exists');
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountValue,
      discountType,
      validTill,
      createdBy: req.user.id,
    });

    sendResponse(res, 201, true, 'Coupon created successfully', coupon);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found');
    }

    sendResponse(res, 200, true, 'Coupon updated successfully', coupon);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found');
    }

    sendResponse(res, 200, true, 'Coupon deleted successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getAllCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
