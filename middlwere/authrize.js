import User from "../models/user.js";
import logger from "../lib/logger/logger.js";
import { roles } from "../enum/roles.enum.js";
import { ActionForbiddenError } from "../errors/actionForbidden.error.js";

export const authorize= async(req,res,next)=>{

    try {
        let userId=res.locals.user.id
        const user=await User.findById(userId);
        if (user.role===roles.ADMIN) {
           return next()
        }
        throw new ActionForbiddenError()
    } catch (error) {
        logger.error(error);
        next(error);
    }
}