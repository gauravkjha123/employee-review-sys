import Joi from "joi";

const userValidation = (data) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().min(2).max(100).required().messages({
        "string.base": `Please give data in json!`,
        "string.min": `First name should have atleast 2 characters!`,
        "string.max": `First name cannot exceed more than 100 characters!`,
        "string.empty": `Please enter first name!`,
      }),
      password: Joi.string().min(4).max(8).messages({
        "string.base": `Please give data in json!`,
        "string.min": `password should have atleast 4 characters!`,
        "string.max": `password should not exceed more than 8 characters!`,
        "string.empty": `Please enter password!`,
      }),
      confirm_password: Joi.string()
        .min(4)
        .max(8)
        .valid(Joi.ref("password"))
        .messages({
            "string.base": "Please provide a valid confirmation password.",
            "string.min": "Confirmation password must be at least 4 characters long.",
            "string.max": "Confirmation password cannot exceed 8 characters.",
            "string.empty": "Please confirm your password.",
            "any.only": "Passwords do not match. Please make sure they match.",
        }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.base": "Please provide a valid email address",
          "string.email": "Please enter a valid email address",
          "any.required": "Email is required. Please provide an email address",
        }),
      companyId:Joi.string().hex().length(24)
      .messages({
        'any.required': 'The "from" field is required.',
      }),
        
    }).unknown(false);

    return schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default userValidation;
