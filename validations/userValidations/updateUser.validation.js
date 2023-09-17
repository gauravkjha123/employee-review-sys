import Joi from "joi";

const updateUserValidation = (data) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().min(2).max(100).required().messages({
        "string.base": `Please give data in json!`,
        "string.min": `First name should have atleast 2 characters!`,
        "string.max": `First name cannot exceed more than 100 characters!`,
        "string.empty": `Please enter first name!`,
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.base": "Please provide a valid email address",
          "string.email": "Please enter a valid email address",
          "any.required": "Email is required. Please provide an email address",
        }),
    }).unknown(false);

    return schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default updateUserValidation;
