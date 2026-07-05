import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        price: Number,
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'razorpay', 'stripe'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: String,
    subtotal: Number,
    tax: Number,
    shippingCost: Number,
    discount: {
      code: String,
      amount: { type: Number, default: 0 },
    },
    totalPrice: Number,
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    notes: String,
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
