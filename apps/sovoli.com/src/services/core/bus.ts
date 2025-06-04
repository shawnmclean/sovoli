import {
  GetOrgInstanceByUsernameQuery,
  GetOrgInstanceByUsernameQueryHandler,
} from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import {
  GetAllWebsiteUsernamesQuery,
  GetAllWebsiteUsernamesQueryHandler,
} from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
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

    this.queryProcessor.register(
      GetAllWebsiteUsernamesQuery,
      new GetAllWebsiteUsernamesQueryHandler(),
    );
    this.queryProcessor.register(
      GetOrgInstanceByUsernameQuery,
      new GetOrgInstanceByUsernameQueryHandler(),
    );
  }
}

export const bus = new Bus();
