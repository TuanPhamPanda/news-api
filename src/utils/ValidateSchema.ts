import joi from 'joi'

export const idSchema = joi.number().integer().required()
export const stringSchema = joi.string().required()
export const imageSchema = joi.string().uri().required()