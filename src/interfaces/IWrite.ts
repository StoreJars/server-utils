export default interface IWrite<T> {
  create(item: T): Promise<T>;
  createMany(item: T[]): Promise<T>;
  deactivate(item: object): Promise<object>;
  update(documentId: object, data: object): Promise<object>;
}
