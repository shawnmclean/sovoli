import { db } from "@sovoli/db";

import { Logger } from "~/core/logger/Logger";

export abstract class BaseService {
  constructor(
    protected readonly dbClient: typeof db = db,
    protected readonly logger: Logger = new Logger(),
  ) {}
}
