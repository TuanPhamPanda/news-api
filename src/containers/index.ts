import Response from './Response'

const notFoundDatabase = (tableName: string, id: number) => {
  return {
    err: 1,
    msg: `No ${tableName} found with id ${id}`,
  }
}

const internalSeverDatabase = (message: string) => {
  return {
    err: 1,
    msg: message,
  }
}

const responseFindDatabase = (response: Response): Response => {
  const result: Record<string, any> = {
    err: response.err ?? 0,
  }

  if (response.msg && typeof response.msg === 'string') {
    result.msg = response.msg
  }

  if (typeof response.response === 'object') {
    if (Array.isArray(response.response)) {
      result.response.response = response.response
    } else {
      for (const key in response.response) {
        if (response.response.hasOwnProperty(key)) {
          result[key] = response.response[key]
        }
      }
    }
  } else {
    result.response = response.response
  }
  return result
}

export {
  notFoundDatabase,
  internalSeverDatabase,
  responseFindDatabase,
  Response,
}
