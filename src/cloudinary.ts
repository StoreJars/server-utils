import Datauri from 'datauri';
const cloudinary = require('cloudinary').v2;

export default class Cloudinary {
  private config: string;

  constructor(config) {
    this.config = config;
    cloudinary.config(this.config);
  }

  public async  uploadImage(file, folderName: string, tags: string) {
    const dataUri = new Datauri();
    const date = Date.now();

    // TODO this events location should be dynamic
    const publicId = `images/${folderName}/${date + file.originalname.split('.').reverse().pop()}`;

    const res = file.originalname.split('.').pop();

    dataUri.format('.' + res, file.buffer);

    return cloudinary.uploader.upload(dataUri.content, { tags, public_id: publicId });
  }
}
