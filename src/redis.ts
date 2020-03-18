import axios from 'axios';
import redis from 'redis';

const redisClient = redis.createClient();

/**
 * This class aims to retun data from one of two sources, 
 * Redis cache or fresh data from server then cache that datat
 */


export default class Query {
  private key;
  private url;
  private token;

  constructor(key, url, token = '') {
    this.key = key;
    this.url = url;
    this.token = token;
  }

  public flush() {
    redisClient.DEL(this.key);
  }

  private set(data) {
    redisClient.set(this.key, JSON.stringify(data));
  }

  private async getLocal() {
    return new Promise((resolve, reject) => {
      redisClient.get(this.key, (error, result) => {
        if (error) {
          reject(error);
        }

        if (result) {
          resolve(result);
        } else {
          resolve('');
        }
      });
    })
  }

  private async getLive() {
    try {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` }
      };

      const response = await axios.get(this.url, config);

      const { data } = response.data;

      this.set(data);

      return data;
    } catch (ex) {
      throw ex;
    }
  }

  public async  get() {
    try {

      // TDODO fix issue where redis is returning earler an undefuned therby crashing the app
      this.flush();

      const res = await this.getLocal();

      if (res) {
        return res;
      } else {
        return await this.getLive();
      }
    } catch (ex) {
      throw ex
    }
  }
}

