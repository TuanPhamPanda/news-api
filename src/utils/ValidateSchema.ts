import joi from 'joi'

export const integerSchema = joi.number().integer()
export const stringSchema = joi.string().required()
export const imageSchema = joi.string().uri().required()
export const phoneNumberSchema = joi.string().required().length(10)
