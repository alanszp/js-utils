import LRUCache, { Options } from "lru-cache";
import { AccessListClient } from "../../dist";

const threeHours = 1000 * 60 * 60 * 3;

const options: Options<string, AccessListClient> = {
  max: 150,
  maxAge: threeHours,
};

export const accessListCache = new LRUCache<string, AccessListClient>(options);
