import { GraphQLClient } from 'graphql-request';
import redis from 'redis';

export function redisConnect(url: string) {
  return redis.createClient(url);
}

/**
 * This class aims to retun data from one of two sources, 
 * Redis cache or fresh data from server then cache that datat
 */

export class Query {
  private url: string;
  private key: string;
  private redisClient;

  constructor(redisClient, key, url) {
    this.url = url;
    this.key = key;
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
      if (this.redisClient.connected) {

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

      } else {
        resolve('');
      }
    })
  }

  private getLive(query, variables): Promise<{}> {
    const client = new GraphQLClient(this.url)

    return client.request(query, variables)
  }

  public async  get(query, variables) {
    // TDODO fix issue where redis is returning earler an undefuned therby crashing the app
    this.flush();

    const res = await this.getLocal();

    if (res) {
      return res;
    } else {
      return this.getLive(query, variables);
    }
  }
}

