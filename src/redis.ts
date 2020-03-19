import axios from 'axios';
import redis from 'redis';

export function redisConnect(url: string) {
  return redis.createClient(url);
}

/**
 * This class aims to retun data from one of two sources, 
 * Redis cache or fresh data from server then cache that datat
 */

export class Query {
  private key;
  private url;
  private token;
  private redisClient;

  constructor(redisClient, key, url, token = '') {
    this.key = key;
    this.url = url;
    this.token = token;
    this.redisClient = redisClient
  }

  public flush() {
    this.redisClient.DEL(this.key);
  }

  private set(data) {
    this.redisClient.set(this.key, JSON.stringify(data));
  }

  private async getLocal() {
    return new Promise((resolve, reject) => {
      this.redisClient.get(this.key, (error, result) => {
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

