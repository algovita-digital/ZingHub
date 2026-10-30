import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true, maxlength: 400 },
    productDetails: {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1, max: 10, default: 1 },
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true } // adds createdAt + updatedAt
);

export default mongoose.model('Order', orderSchema);
