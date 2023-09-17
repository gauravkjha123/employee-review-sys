import authValidation from "../validations/userValidations/auth.validation.js";
import userValidation from "../validations/userValidations/user.validation.js";
import logger from "../lib/logger/logger.js";
import User from "../models/user.js";
import Company from "../models/company.js";
import jwt from "jsonwebtoken";
import  { env } from '../env.js'
import {
  UserNotFoundError,
  invalidCredentialsError,
  UserAlreadyExistError,
  PasswordNotMatchError,
} from "../errors/user.error.js";

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
    if (!users || !users.length) {
      throw new UserNotFoundError();
    }
    return res.render("_employee_view",{employees:users});
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
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
    let { password, confirm_password, email } = req.body;
    if (confirm_password !== password) {
      throw new PasswordNotMatchError();
    }
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new UserAlreadyExistError(isUserExist.email);
    }

    const newUser = new User(req.body);
    await newUser.save();

    req.flash("success_msg", "Resistaration succefully");
    return res.redirect("/user/sign-in");
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