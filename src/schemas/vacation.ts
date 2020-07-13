import joi from "@hapi/joi";

export const vacationSchema = joi.object({
  userId: joi.number().integer().required(),
  description: joi.string().min(1).max(500).required(),
  destination: joi.string().min(1).max(500).required(),
  departure: joi.date().required(),
  returnAt: joi.date().required(),
  price: joi.number().required(),
});
