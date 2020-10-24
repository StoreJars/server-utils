export default interface IWrite<T> {
  create(item: T): Promise<T>;
  createMany(item: T[]): Promise<T>;
  deactivate(item: Record<string, unknown>): Promise<unknown>;
  update(documentId: Record<string, unknown>, data: Record<string, unknown>): Promise<unknown>;
}
