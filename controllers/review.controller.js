import logger from "../lib/logger/logger.js";
import Review from "../models/review.js";
import User from "../models/user.js";
import createReviewValidation from '../validations/reviewValidations/createReview.validation.js'
import updateReviewValidation from '../validations/reviewValidations/updateReview.validation.js'
import { ReviewNotFoundError,ReviewAlreadyExistError,SameReviewrAndRecipentError } from "../errors/review.error.js";
import { UserNotFoundError } from "../errors/user.error.js";
import { ActionForbiddenError } from "../errors/actionForbidden.error.js";
import {roles} from '../enum/roles.enum.js'

export const dashBoard = async(req, res) => {
  try {
    let companyId = res.locals.user.companyId    ;
    let userId = res.locals.user.id    ;

    let from = await Review.find({companyId:companyId,from:userId,isReviewed:false},{password:0}).populate('from') .populate('to');
    let to = await Review.find({companyId:companyId,to:userId,isReviewed:true},{password:0}).populate('user').populate('from') .populate('to');

    return res.render("_dashboard",{from:from,to:to});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { user } = res.locals;
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
    
    if (from._id.equals(to._id)) {
      throw new SameReviewrAndRecipentError()
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

    req.flash("success_msg", 'Review assign succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
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
    let userId =res.locals.user.id;

    // Check if userId, habitId, and user's rights are valid
    if (!userId || !reviewId || !(await checkRightForUpdate(userId, reviewId))) {
      throw new ActionForbiddenError();
    }

    const review =await Review.findById(reviewId);
    if (!review) {
      throw ReviewNotFoundError()
    }
    await Review.findOneAndUpdate(
      { _id: reviewId },  // Your query
      req.body,         //  New values to set
      { new: true }    //   Return the updated document
    );
    req.flash("success_msg", 'Review update succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }

}

export const getAllReviews = async(req, res) => {
  try {
    let companyId = res.locals.user.companyId;
    let reviews = await Review.find({companyId:companyId}).populate('from').populate('to');
    if (!reviews) {
      throw new ReviewNotFoundError();
    }
    return res.render("_employee_review",{reviews:reviews});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.status(error.status??500).json({status:false,message:error.message});
  }
};

export const assignReview = async(req, res) => {
  try {
    let companyId = res.locals.user.companyId;
    let users = await User.find({companyId:companyId},{password:0});
    if (!users ) {
      throw new UserNotFoundError();
    }
    return res.render("_assign_review",{employee:users});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
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
    if (review.from.equals(user.id)) {
      return true;
    }
    if (user.role===roles.ADMIN && user.companyId.equals(review.companyId)) {
      return true;
  }
    return false;
  } catch (error) {
    return false;
  }
}