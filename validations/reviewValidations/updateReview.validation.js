import joi from "joi";

const updateReviewValidation = (data) => {
  try {
    const Schema = joi
      .object({
        message:joi.string().min(2).max(100).required().messages({
          "string.base": `Please give data in json!`,
          "string.min": `First name should have atleast 2 characters!`,
          "string.max": `First name cannot exceed more than 100 characters!`,
          "string.empty": `Please enter first name!`,
        }),
        isReviewed: joi.boolean()
        .messages({
          'boolean.base': 'The "isReviewed" field must be a boolean.',
        }),
      })
      .unknown(false);

    return Schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default updateReviewValidation;
