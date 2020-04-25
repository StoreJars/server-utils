
const cloudinary = require('cloudinary').v2;

export default class Cloudinary {
  constructor(config) {
    cloudinary.config(config);
  }

  public async  uploadImageStream(file, folderName: string, tags: string): Promise<any> {
    const date = Date.now();

    // TODO this events location should be dynamic
    const publicId = `images/${folderName}/${date + file.filename.split('.').reverse().pop()}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ tags, public_id: publicId }, (err, image) => {

        if (err) {
          reject(err);
        }
        resolve(image)
      })

      file.createReadStream().pipe(uploadStream);
    })
  }

  public async uploadImage(file, folderName: string, tags: string): Promise<any> {

  }

  public async deleteImage(imageUrl) {
    // validate image url here
    return cloudinary.uploader.destroy(imageUrl);
  }
}
