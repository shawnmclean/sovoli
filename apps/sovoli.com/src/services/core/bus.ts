import {
  GetUsernameByDomainQuery,
  GetUsernameByDomainQueryHandler,
} from "~/modules/websites/services/queries/GetUsernameByDomainQuery";
import {
  GetUserProfileByUsernameQuery,
  GetUserProfileByUsernameQueryHandler,
} from "../users/queries/GetUserProfileByUsernameQuery";
import { QueryProcessor } from "./QueryProcessor";

export class Bus {
  public readonly queryProcessor: QueryProcessor;

  constructor() {
    this.queryProcessor = new QueryProcessor();

    this.registerHandlers();
  }

  private registerHandlers() {
    this.queryProcessor.register(
      GetUserProfileByUsernameQuery,
      new GetUserProfileByUsernameQueryHandler(),
    );
    this.queryProcessor.register(
      GetUsernameByDomainQuery,
      new GetUsernameByDomainQueryHandler(),
    );
  }
}

export const bus = new Bus();
