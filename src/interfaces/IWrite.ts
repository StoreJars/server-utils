import { ObjectID } from 'mongodb';

export default interface IWrite<T> {
  create(item: T): Promise<T>;
  createMany(item: T[]): Promise<T>;
  deactivate(item: ObjectID): Promise<unknown>;
  update(documentId: ObjectID, data: Record<string, unknown>): Promise<unknown>;
}
