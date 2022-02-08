import { IMeta } from '.';

export default interface IMetaExtended extends IMeta {
  verified: boolean;
  verifiedAt: Date;
}
