import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";
import { ORGS } from "~/modules/data/organisations";

interface Result {
  usernames: string[];
}

export class GetAllWebsiteUsernamesQuery implements Query<Result> {
  resultType?: Result;
}

export class GetAllWebsiteUsernamesQueryHandler
  implements QueryHandler<GetAllWebsiteUsernamesQuery, Result>
{
  async handle(_: GetAllWebsiteUsernamesQuery): Promise<Result> {
    return await Promise.resolve({
      usernames: ORGS.filter((entry) => entry.websiteModule).map(
        (entry) => entry.org.username,
      ),
    });
  }
}
