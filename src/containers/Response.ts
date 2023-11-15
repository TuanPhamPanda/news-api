export default class Response {
  err?: number
  response?: any
  msg?: string

  constructor(response?: any, msg?: string, err?: number) {
    this.response = response
    this.msg = msg
    this.err = err
  }
}
