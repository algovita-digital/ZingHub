import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ isApproved: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);
