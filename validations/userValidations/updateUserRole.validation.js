import Joi from "joi";
import { roles } from "../../enum/roles.enum.js";

const updateUserRoleValidation = (data) => {
  try {
    const schema = Joi.object().keys({
        role: Joi.number()
          .valid(...Object.values(roles)) // Use Object.values() to get the enum values from the 'roles' object
          .required()
          .messages({
            "any.only": "Invalid role. Please provide a valid role",
            "any.required": "role is required. Please provide a role",
          }),
    }).unknown(false);
    return schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default updateUserRoleValidation;
