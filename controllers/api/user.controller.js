import updateUserRoleValidation from "../../validations/userValidations/updateUserRole.validation.js";
import logger from "../../lib/logger/logger.js";
import User from "../../models/user.js";
import Company from "../../models/company.js";
import Review from "../../models/review.js";
import { ActionForbiddenError } from "../../errors/actionForbidden.error.js";
import { UserNotFoundError } from "../../errors/user.error.js";
import { roles } from "../../enum/roles.enum.js";

export const updateUserRole = async (req, res, next) => {
  try {
    let validate = updateUserRoleValidation(req.body);
    if (validate.error) {
      const { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message });
    }

    let userId = req.params.id;
    let requesterId = req.user.id;
    let companyId = req.user.companyId;
    if (!userId || !(await checkRightForRole(userId, requesterId, companyId))) {
      throw new ActionForbiddenError();
    }
    let user = await User.findById(userId, { password: 0 });
    if (!user) {
      throw new UserNotFoundError();
    }
    const updatedDoc = await User.findByIdAndUpdate(user._id, req.body, {
      new: true, // To return the updated document
    });
    return res
      .status(200)
      .json({
        status: true,
        data: updatedDoc,
        message: "Role changed successfully",
      });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    let userId = req.params.id;
    let requesterId = req.user.id;
    if (!userId || !requesterId || !(await checkRight(userId, requesterId))) {
      throw new ActionForbiddenError();
    }
    let user = await User.findById(userId, { password: 0 });
    if (!user) {
      throw new UserNotFoundError();
    }
    let company=await Company.findOne({users:user._id})
    company.users.pull(user._id);
    await User.deleteOne({ _id: user._id });
    await Review.deleteMany({
      $or: [{ from: user._id }, { to: user._id }],
    });
    await company.save();

    // Respond with a success message
    return res
      .status(200)
      .json({
        status: true,
        data: undefined,
        message: "User deleted successfully",
      });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const checkRight = async (userId, requesterId) => {
  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);
    if (!user) {
      throw new UserNotFoundError();
    }
    if (
      requester.role === roles.ADMIN &&
      user.companyId.equals(user.companyId)
    ) {
      return true;
    }
    if (user.id === requesterId) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const checkRightForRole = async (userId, requesterId, companyId) => {
  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);
    if (!user) {
      throw new UserNotFoundError();
    }
    if (requester.role === roles.ADMIN && user.companyId.equals(companyId)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
