import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, title } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.title = title;
      await existingReview.save();
      
      // Recalculate product rating
      const reviews = await Review.find({ product: productId });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      product.rating = avgRating;
      await product.save();

      return res.json({ success: true, message: 'Review updated', review: existingReview });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
      title
    });

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    product.rating = avgRating;
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({ success: true, message: 'Review created', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;

    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.title = title || review.title;
    await review.save();

    res.json({ success: true, message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(productId, {
        rating: avgRating,
        numReviews: reviews.length
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0
      });
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
