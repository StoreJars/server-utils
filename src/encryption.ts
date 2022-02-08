import { createCipheriv, createHash, createDecipheriv } from 'crypto';

const hashSha2 = createHash('sha256');
const hashMD5 = createHash('md5');
const hashSha1 = createHash('sha1');

export default class Crypto {
  private algorithm: string;
  private cipherKey: string;

  constructor(algorithm, cipherKey) {
    this.algorithm = algorithm;
    this.cipherKey = cipherKey;
  }

  public async generateSha2(str) {
    return hashSha2.update(str, 'utf8').digest('hex');
  }

  public async generateSha1(str) {
    return hashSha1.update(str, 'utf8').digest('hex');
  }

  public async generateMD5(str) {
    return hashMD5.update(str, 'utf8').digest('hex');
  }

  public async encrypt(text) {
    const cipher = createCipheriv(this.algorithm, this.cipherKey, 'ew');
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  public async decrypt(text) {
    const decipher = createDecipheriv(this.algorithm, this.cipherKey, 'ew');
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
