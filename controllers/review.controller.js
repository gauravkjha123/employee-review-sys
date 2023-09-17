import logger from "../lib/logger/logger.js";
import Review from "../models/review.js";
import User from "../models/user.js";
import { ReviewNotFoundError } from "../errors/review.error.js";
import { UserNotFoundError } from "../errors/user.error.js";

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

export const getAllReviews = async(req, res) => {
  try {
    let companyId = res.locals.user.companyId;
    let reviews = await Review.find({companyId:companyId},{password:0});
    if (!reviews || !reviews.length) {
      throw new ReviewNotFoundError();
    }
    return res.render("_employee_review",{reviews:reviews});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
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
