import {
  GetAllWebsiteUsernamesQuery,
  GetAllWebsiteUsernamesQueryHandler,
} from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import {
  GetUsernameByDomainQuery,
  GetUsernameByDomainQueryHandler,
} from "~/modules/websites/services/queries/GetUsernameByDomainQuery";
import {
  GetWebsiteByUsernameQuery,
  GetWebsiteByUsernameQueryHandler,
} from "~/modules/websites/services/queries/GetWebsiteByUsername";
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
    this.queryProcessor.register(
      GetWebsiteByUsernameQuery,
      new GetWebsiteByUsernameQueryHandler(),
    );
    this.queryProcessor.register(
      GetAllWebsiteUsernamesQuery,
      new GetAllWebsiteUsernamesQueryHandler(),
    );
  }
}

export const bus = new Bus();
