import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.string().pattern(/^\d{3}-\d{3}-\d{2}-\d{2}$/).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.string().
    pattern(/^\d{3}-\d{3}-\d{2}-\d{2}$/).required(),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});