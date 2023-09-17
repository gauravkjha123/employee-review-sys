import logger from "../../lib/logger/logger.js";
import Review from "../../models/review.js";
import User from "../../models/user.js";
import { ReviewAlreadyExistError, ReviewNotFoundError } from "../../errors/review.error.js";
import { ActionForbiddenError } from "../../errors/actionForbidden.error.js";
import createReviewValidation from "../../validations/reviewValidations/createReview.validation.js";
import { UserNotFoundError } from "../../errors/user.error.js";
import updateReviewValidation from "../../validations/reviewValidations/updateReview.validation.js";
import { roles } from "../../enum/roles.enum.js";

export const createReview = async (req, res, next) => {
  try {
    const { user } = req;
    const reviewData = req.body; // Assuming you receive review data in the request body

    // Validate the review data using createReviewValidation
    // If validation fails, return an error response
    const validate = createReviewValidation(reviewData);
    if (validate.error) {
      const { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message })
    }

    // Check if a review with the same name already exists for the user
    const existingRevied = await Review.findOne({ from:reviewData.from, to:reviewData.to,isReviewed:false });
    if (existingRevied) {
      throw new ReviewAlreadyExistError();
    }

    let from = await User.findById(reviewData.from);
    let to =await User.findById(reviewData.to);
    if (!from || !to ) {
        throw UserNotFoundError()
    }
    if (!from.companyId.equals(to.companyId) || !user.companyId.equals(from.companyId)) {
      throw new ActionForbiddenError();
    }
        // Create and save the new review

    const reviewDetails={
      from:reviewData.from,
      to:reviewData.to,
      isReviewed:false,
      companyId:user.companyId

    }
    const newReview = new Review({ ...reviewDetails});
    await newReview.save();

    return res.status(201).json({ status: true, data: newReview });
  } catch (error) {
    logger.error(error)
    next(error);
  }
};

export const updateReview = async (req,res,next) => {

  try {
    const validate = updateReviewValidation(req.body);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message })
    }
    let reviewId = req.params.id;
    let userId =req.user.id;

    // Check if userId, habitId, and user's rights are valid
    if (!userId || !reviewId || !(await checkRightForUpdate(userId, reviewId))) {
      throw new ActionForbiddenError();
    }

    const review =await Review.findById(reviewId);
    if (!review) {
      throw ReviewNotFoundError()
    }
    const updatedDoc = await Review.findOneAndUpdate(
      { _id: reviewId },  // Your query
      req.body,         //  New values to set
      { new: true }    //   Return the updated document
    );
    return res.status(200).json({ status: true, data: updatedDoc })
  } catch (error) {
    logger.error(error);
    logger.error(error)
    next(error)
  }

}

export const deleteReview = async (req, res, next) => {
  let userId = req.user.id;
  let reviewId = req.params.id;

  // Check if userId, habitId, and user's rights are valid
  if (!userId || !reviewId || !(await checkRightForDelete(userId, habitId))) {
    throw new ActionForbiddenError();
  }

  try {
    // Find the review by ID
    const review = await Review.findById(habitId);

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

const checkRightForUpdate= async(userId,reviewId)=>{
  try {
    const review =await Review.findById(reviewId);
    const user= await User.findById(userId)

    if (!user) {
      throw new UserNotFoundError();
    }
    if (!review) {
      throw ReviewNotFoundError()
    }
    if (review.from===user.id) {
      return true;
    }
    if (user.role===roles.ADMIN && user.companyId===review.companyId) {
      return true;
  }
    return false;
  } catch (error) {
    return false;
  }
}

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
    if (user.role===roles.ADMIN && user.companyId===review.companyId) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}