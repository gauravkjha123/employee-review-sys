import authValidation from "../validations/userValidations/auth.validation.js";
import userValidation from "../validations/userValidations/user.validation.js";
import updateUserValidation from "../validations/userValidations/updateUser.validation.js";
import logger from "../lib/logger/logger.js";
import User from "../models/user.js";
import Company from "../models/company.js";
import jwt from "jsonwebtoken";
import { roles } from "../enum/roles.enum.js";
import  { env } from '../env.js'
import {
  UserNotFoundError,
  invalidCredentialsError,
  UserAlreadyExistError,
  PasswordNotMatchError,
} from "../errors/user.error.js";
import { ActionForbiddenError } from "../errors/actionForbidden.error.js";
import { CompanyNotFoundError } from "../errors/company.error.js";


export const signUp = async (req, res) => {
  let company=await Company.find({})
  return res.render("_singUp",{company});
};

export const login = (req, res) => {
  return res.render("_login");
};

export const getAllUsers = async(req, res) => {

  try {
    let companyId = res.locals.user.companyId;
    let users = await User.find({companyId:companyId},{password:0});
    if (!users) {
      throw new UserNotFoundError();
    }
    return res.render("_employee_view",{employees:users});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.status(error.status??500).json({status:false,message:error.message});
  }
};

export const getUserById = async(req, res) => {
  try {
    let userId = req.locals.User.id;
    let user = await User.findById({ id:userId },{password:0});
    if (!user) {
      throw new UserNotFoundError();
    }
    return res.render("_employee_view",{employee:user});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const create = async (req, res) => {
  try {
    let validate = userValidation(req.body);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      req.flash("error_msg", message);
      return res.redirect("back");
    }
    let { password, confirm_password, email,companyId } = req.body;
    if (confirm_password !== password) {
      throw new PasswordNotMatchError();
    }
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new UserAlreadyExistError(isUserExist.email);
    }
    let company =await Company.findById(companyId);
    if (!company) {
      throw new CompanyNotFoundError()
    }

    const newUser = new User(req.body);
    company.users.push(newUser)
    await newUser.save();
    await company.save()
    
    req.flash("success_msg", "Resistaration succefully");
    return res.redirect("/user/sign-in");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const updateUser = async(req, res) => {
  try {
    let validate = updateUserValidation(req.body);
    if (validate.error) {
      const { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message })
    }

    let userId = req?.params?.id;
    let requesterId=res?.locals?.user?.id;
    let companyId=res?.locals?.user?.companyId;
      if (!userId || !(await checkRight(userId,requesterId,companyId))) {
      throw new ActionForbiddenError();
    }
    let user = await User.findById(userId,{password:0});
    if (!user) {
      throw new UserNotFoundError();
    }
    const updatedDoc= await User.findByIdAndUpdate(user._id, req.body, {
      new: true, // To return the updated document
    });
    req.flash("success_msg", 'Review update succesfully');
    return res.redirect("back");
   } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};


export const createSession = async (req, res) => {
  try {
    let validate = authValidation(req.body);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      req.flash("error_msg", message);
      return res.redirect("back");
    }
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      throw new UserNotFoundError();
    }
    let isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
      throw new invalidCredentialsError();
    }
    const token = await jwt.sign({id:user.id}, env.jwt.secret, {
      algorithm: env.jwt.algorithm,
      expiresIn: env.jwt.expireIN ,
    });
    req.session.token = token;
    req.session.save()
    req.flash("success_msg", "Login succseefully");
    return res.redirect("/review");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const logOut=(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      console.log('Session destroyed successfully');
    }
  }); 
  return res.redirect('/user/sign-in');
}

const checkRight= async(userId,requesterId,companyId)=>{
  try {
    const user = await User.findById(userId);
    const requester=await User.findById(requesterId);
    if (!user) {
      throw new UserNotFoundError();
    }
      if (requester.role===roles.ADMIN && user.companyId.equals(companyId)) {
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