import joi from "joi";

const createReviewValidation = (data) => {
  try {
    const Schema = joi
      .object({
        from:  joi.string().hex().length(24)
        .messages({
          'any.required': 'The "from" field is required.',
        }),
        to: joi.string().hex().length(24)
        .messages({
          'any.required': 'The "to" field is required.',
        })
      })
      .unknown(false);

    return Schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default createReviewValidation;
