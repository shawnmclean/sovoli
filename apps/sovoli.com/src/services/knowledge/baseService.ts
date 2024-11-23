import { db } from "@sovoli/db";

export abstract class BaseService {
  constructor(protected readonly dbClient: typeof db = db) {}
}
