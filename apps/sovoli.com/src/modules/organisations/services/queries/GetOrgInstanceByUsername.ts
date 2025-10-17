import type { OrgInstance } from "~/modules/organisations/types";
import type { Query } from "~/services/core/Query";
import type { QueryHandler } from "~/services/core/QueryHandler";
import { ORGS } from "~/modules/data/organisations";
import { computeOrgScoring } from "~/modules/scoring/lib/computeOrgScoring";

interface Result {
  orgInstance: OrgInstance | null;
}

export class GetOrgInstanceByUsernameQuery implements Query<Result> {
  resultType?: Result;

  constructor(public readonly username: string) {}
}

export class GetOrgInstanceByUsernameQueryHandler
  implements QueryHandler<GetOrgInstanceByUsernameQuery, Result>
{
  async handle(query: GetOrgInstanceByUsernameQuery): Promise<Result> {
    const entry = await Promise.resolve(
      ORGS.find(
        (entry) =>
          entry.org.username.toLowerCase() === query.username.toLowerCase(),
      ),
    );

    if (!entry) return { orgInstance: null };

    const scoringModule = await computeOrgScoring(entry);

    return {
      orgInstance: {
        org: entry.org,
        scoringModule,
        websiteModule: entry.websiteModule ?? null,
        academicModule: entry.academicModule ?? null,
        serviceModule: entry.serviceModule ?? null,
        workforceModule: entry.workforceModule ?? null,
        catalogModule: entry.catalogModule ?? null,
        eventModule: entry.eventModule ?? null,
      },
    };
  }
}
