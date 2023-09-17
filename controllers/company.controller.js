import companyValidation from "../validations/companyValidations/company.validation.js";
import Company from "../models/company.js";
import User from "../models/user.js";
import logger from "../lib/logger/logger.js";
import { roles } from "../enum/roles.enum.js";
import { PasswordNotMatchError, UserAlreadyExistError } from "../errors/user.error.js";


export const createCompany = async (req, res, next) => {
    try {
      const companyData = req.body; // Assuming you receive company data in the request body
  
      // Validate the company data using companyValidation
      // If validation fails, return an error response
      const validate = companyValidation(companyData);
      if (validate.error) {
        const { details } = validate.error;
        const message = details.map((i) => i.message).join(",");
        logger.error(message);
        return res.status(400).json({ status: false, massage: message })
      }
  
      let { password, confirm_password, email } = companyData;
      let { companyName, discription }=companyData;
      if (confirm_password !== password) {
        throw new PasswordNotMatchError();
      }
      let isUserExist = await User.findOne({ email });
      if (isUserExist) {
        throw new UserAlreadyExistError(isUserExist.email);
      }
      const newCompany=new Company({companyName,discription})
      await newCompany.save();

      const newUser = new User({...companyData,companyId:newCompany._id,role:roles.ADMIN});
      await newUser.save();
  
      req.flash("success_msg", "Resistaration succefully");
      return res.redirect("/user/sign-in");
    } catch (error) {
        logger.error(error);
        req.flash("error_msg", error.message);
        return res.redirect("back");
    }
  };


  export const renderCreateCompany = async (req, res, next) => {
      return res.render('_create_company')
  };