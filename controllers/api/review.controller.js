import logger from "../../lib/logger/logger.js";
import Review from "../../models/review.js";
import User from "../../models/user.js";
import { ReviewNotFoundError } from "../../errors/review.error.js";
import { ActionForbiddenError } from "../../errors/actionForbidden.error.js";
import { UserNotFoundError } from "../../errors/user.error.js";
import { roles } from "../../enum/roles.enum.js";


export const deleteReview = async (req, res, next) => {
  let userId = req.user.id;
  let reviewId = req.params.id;

  // Check if userId, habitId, and user's rights are valid
  if (!userId || !reviewId || !(await checkRightForDelete(userId, reviewId))) {
    throw new ActionForbiddenError();
  }

  try {
    // Find the review by ID
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ReviewNotFoundError();
    }

    // Delete the review
    await Review.deleteOne({ _id: review._id });

    // Respond with a success message
    return res.status(200).json({ status: true, message: 'Habit deleted successfully' });
  } catch (error) {
    logger.error(error)
    next(error);
  }
};


const checkRightForDelete= async(userId,reviewId)=>{
  try {
    const review =await Review.findById(reviewId);
    const user= await User.findById(userId)

    if (!user) {
      throw new UserNotFoundError();
    }
    if (!review) {
      throw ReviewNotFoundError()
    }
    if (user.role===roles.ADMIN && user.companyId.equals(review.companyId)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}