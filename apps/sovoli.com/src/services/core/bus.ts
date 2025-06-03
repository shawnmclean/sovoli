import {
  GetWebsiteByCustomDomainQuery,
  GetWebsiteByCustomDomainQueryHandler,
} from "~/modules/websites/services/queries/GetWebsiteByCustomDomainQuery";
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
      GetWebsiteByCustomDomainQuery,
      new GetWebsiteByCustomDomainQueryHandler(),
    );
  }
}

export const bus = new Bus();
