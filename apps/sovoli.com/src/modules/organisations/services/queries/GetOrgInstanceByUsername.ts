import { ORGS } from "~/modules/data/organisations";
import type { OrgInstance } from "~/modules/organisations/types";
import { computeOrgScoring } from "~/modules/scoring/lib/computeOrgScoring";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";

export interface GetOrgInstanceByUsernameResult {
  orgInstance: OrgInstance | null;
}

export class GetOrgInstanceByUsernameQuery
  implements Query<GetOrgInstanceByUsernameResult>
{
  resultType?: GetOrgInstanceByUsernameResult;

  constructor(public readonly username: string) {}
}

export class GetOrgInstanceByUsernameQueryHandler
  implements
    QueryHandler<GetOrgInstanceByUsernameQuery, GetOrgInstanceByUsernameResult>
{
  async handle(
    query: GetOrgInstanceByUsernameQuery,
  ): Promise<GetOrgInstanceByUsernameResult> {
    if (typeof query.username !== "string" || query.username.trim() === "") {
      return { orgInstance: null };
    }

    const username = query.username.toLowerCase();
    const entry = await Promise.resolve(
      ORGS.find(
        (entry) =>
          typeof entry.org.username === "string" &&
          entry.org.username.toLowerCase() === username,
      ),
    );

    if (!entry) return { orgInstance: null };

    const scoringModule = await computeOrgScoring(entry);

    return {
      orgInstance: {
        ...entry,
        scoringModule,
      },
    };
  }
}
