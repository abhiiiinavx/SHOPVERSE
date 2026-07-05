import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/helpers.js';

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'Reviews fetched successfully', reviews);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existingReview) {
      return sendError(res, 400, 'You have already reviewed this product');
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    product.rating = avgRating;
    product.numOfReviews = reviews.length;
    await product.save();

    await review.populate('user', 'name avatar');

    sendResponse(res, 201, true, 'Review created successfully', review);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user.id) {
      return sendError(res, 403, 'Not authorized to update this review');
    }

    Object.assign(review, req.body);
    await review.save();
    await review.populate('user', 'name avatar');

    sendResponse(res, 200, true, 'Review updated successfully', review);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to delete this review');
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const reviews = await Review.find({ product: productId });
    if (reviews.length > 0) {
      const avgRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(productId, {
        rating: avgRating,
        numOfReviews: reviews.length,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        numOfReviews: 0,
      });
    }

    sendResponse(res, 200, true, 'Review deleted successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
