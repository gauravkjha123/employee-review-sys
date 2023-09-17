import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: String, 
  isReviewed: {
    type: Boolean,
    default: false,
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
