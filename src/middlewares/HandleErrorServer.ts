import { Response } from 'express'

export function internalServer(response: Response, error: any) {
  return response.status(500).json(error)
}

//404
//401
//403
