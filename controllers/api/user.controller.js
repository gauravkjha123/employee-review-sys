import updateUserValidation from "../../validations/userValidations/updateUser.validation.js";
import { ActionForbiddenError } from "../../errors/actionForbidden.error.js";
import User from "../../models/user.js";
import { UserNotFoundError } from "../../errors/user.error.js";
import { roles } from "../../enum/roles.enum.js";


export const updateUser = async(req, res) => {
    try {
      let validate = updateUserValidation(req.body);
      if (validate.error) {
        const { details } = validate.error;
        const message = details.map((i) => i.message).join(",");
        logger.error(message);
        return res.status(400).json({ status: false, massage: message })
      }

      let userId = req.params.id;
      let requesterId=req.user.id;
      let companyId=req.user.companyId;
        if (!userId || !(await checkRight(userId,requesterId,companyId))) {
        throw new ActionForbiddenError();
      }
      let user = await User.findById({ id:userId },{password:0});
      if (!user) {
        throw new UserNotFoundError();
      }
      const updatedDoc= await User.findByIdAndUpdate(user._id, req.body, {
        new: true, // To return the updated document
      });
      return res.status(200).json({ status: true, data: updatedDoc })
     } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  export const deleteUser = async(req, res) => {
    try {

      let userId = req.params.id;
      let requesterId=req.user.id;
        if (!userId || requesterId || !(await checkRight(userId,requesterId))) {
        throw new ActionForbiddenError();
      }
      let user = await User.findById({ id:userId },{password:0});
      if (!user) {
        throw new UserNotFoundError();
      }
      await User.deleteOne({ _id: user._id });

      // Respond with a success message
      return res.status(200).json({ status: true, message: 'User deleted successfully' });
     } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  const checkRight= async(userId,requesterId,companyId)=>{
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }
        if (user.role===roles.ADMIN && user.companyId===companyId) {
            return true;
        }
        if (user.id===requesterId) {
            return true
        }
      return false;
    } catch (error) {
      return false;
    }
  }