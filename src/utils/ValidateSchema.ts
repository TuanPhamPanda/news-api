import joi from 'joi'

export const idSchema = joi.number().integer().required()
export const nameSchema = joi.string().required()