import { ObjectID } from 'mongodb';

export default interface IRead<T> {
  find(query: object, filter: object): Promise<T[]>;
  findOne(query: object, filter: object): Promise<T>;
  findOneById(id: ObjectID, message: string, filter: object): Promise<T>;
  findOneByIdAndStoreId(id: ObjectID, storeId: ObjectID, message: string, filter: object): Promise<T>;
  findOneByShortIdAndStoreId(shortId: string, storeId: ObjectID, message: string, filter: object): Promise<T>;
  aggregate(query): Promise<T>;
}
