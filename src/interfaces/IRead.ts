import { ObjectID } from 'mongodb';

export default interface IRead<T> {
  find(query: object, filter: object): Promise<T[]>;
  findOne(query: object, filter: object): Promise<T>;
  findOneById(id: ObjectID, message: string, filter: object): Promise<T>;
  aggregate(query): Promise<T>;
}
