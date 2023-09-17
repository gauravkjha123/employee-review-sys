import joi from "joi";

const authValidation = (data) => {
  try {
    const Schema = joi
      .object({
        email: joi
          .string()
          .email({ tlds: { allow: false } })
          .required()
          .messages({
            "string.base": "Please provide a valid email address",
            "string.email": "Please enter a valid email address",
            "any.required":
              "Email is required. Please provide an email address",
          }),
        password: joi.string().required().min(4).max(10).messages({
          "string.base": "Please provide a valid password",
          "string.empty": "Password cannot be empty",
          "string.min": "Password must be at least 4 characters long",
          "string.max": "Password cannot exceed 10 characters",
          "any.required": "Password is required. Please enter a password",
        }),
      })
      .unknown(false);

    return Schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default authValidation;
