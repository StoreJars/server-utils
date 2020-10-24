import { ObjectID } from 'mongodb';

export default interface IRead<T> {
  find(query: Record<string, unknown>, filter: Record<string, unknown>): Promise<T[]>;
  findOne(query: Record<string, unknown>, filter: Record<string, unknown>): Promise<T>;
  findOneById(id: ObjectID, message: string, filter: Record<string, unknown>): Promise<T>;
  aggregate(query): Promise<T>;
}
