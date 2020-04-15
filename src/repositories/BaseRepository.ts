import { Collection, Db, ObjectID } from 'mongodb';

import { objectId } from '../utils';
import { NotFoundError } from '../errors';
import { IRead, IWrite, IMeta } from '../interfaces';

export default abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

  public readonly collection: Collection;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  public async create(item: T): Promise<T> {
    const meta: IMeta = {
      createdAt: new Date(),
      active: true,
      activatedAt: new Date(),
      deactivatedAt: null,
      updatedAt: null,
    };

    const itemWithMeta = Object.assign(item, { meta });

    const result = await this.collection.insertOne(itemWithMeta);

    return result.ops[0];
  }

  public async createMany(items: T[]): Promise<T> {

    const result = await this.collection.insertMany(items);

    return result.ops[0];
  }

  public async find(query?: object, filter?: object): Promise<T[]> {

    // this should only return things that have been deleted
    return this.collection.find({ ...query, 'meta.active': true }, filter).toArray();
  }

  public async findOne(query?: object, filter?: object): Promise<T> {

    return this.collection.findOne({ ...query, 'meta.active': true }, filter);
  }

  public async findOneById(id: ObjectID, message?: string, filter?: object): Promise<T> {

    const newId = objectId(id);

    const res = await this.collection.findOne({ '_id': newId, 'meta.active': true }, filter);

    if (!res) {
      throw new NotFoundError(message || 'not found');
    }

    return res;
  }

  public async findOneByIdAndVendor(id: ObjectID, vendorId: ObjectID, message?: string, filter?: object): Promise<T> {

    const newId = objectId(id);
    const newVendorId = objectId(vendorId);

    const res = await this.collection.findOne({ '_id': newId, 'vendorId': newVendorId, 'meta.active': true }, filter);

    if (!res) {
      throw new NotFoundError(message || 'not found');
    }

    return res;
  }

  public async aggregate(query): Promise<any> {
    // find a way to attach meta.active === true to only return items that are active
    return this.collection.aggregate(query).toArray();
  }

  public async update(id: ObjectID, query: object): Promise<any> {

    const convertedId = objectId(id);

    const updateResult = await this.collection.findOneAndUpdate(
      { _id: convertedId },
      query,
      {
        returnOriginal: false,
      }
    );
    // find a way to know when the doc was updated
    // if theres no value, the item wasnt modified so we throw and error to indicate an unsuccessful action
    if (!updateResult.value) {
      throw new NotFoundError('item not found');
    }

    return updateResult.value;
  }

  public async deactivate(id: ObjectID): Promise<any> {

    const convertedId = objectId(id);

    const updateResult = await this.collection.findOneAndUpdate(
      { _id: convertedId },
      {
        $set: {
          'meta.active': false,
          'meta.deactivatedAt': new Date(),
        },
      },
      {
        returnOriginal: false,
      },
    );

    /**
     * There a minimal bug here, wwe should check if the item exists before trying to delete, other wise the user can keep on deleting na already deleted item, this really wont be na issue for now, but in the future ?
     */

    // if theres no value, the item was not modified so we throw and error to indicate an unsuccessful action
    if (!updateResult.value) {
      throw new NotFoundError('item not found');
    }

    return updateResult.value;
  }
}
