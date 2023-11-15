export default interface Service<T> {
  getAll(): Promise<any>
  getById(id: number): Promise<any>
  create(data: T): Promise<any>
  delete(id: number): Promise<any>
  update(id: number, data: T): Promise<any>
}
