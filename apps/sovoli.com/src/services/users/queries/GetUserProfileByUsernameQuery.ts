import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";

import type { QueryHandler } from "../../core/QueryHandler";
import type { Query } from "~/services/core/Query";

export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  image: SelectMediaAssetSchema | null;
}

export interface GetUserProfileByUsernameQueryResult {
  user?: UserProfile | null;
}

export class GetUserProfileByUsernameQuery
  implements Query<GetUserProfileByUsernameQueryResult>
{
  resultType?: GetUserProfileByUsernameQueryResult | undefined;
  constructor(public readonly username: string) {}
}

export class GetUserProfileByUsernameQueryHandler
  implements
    QueryHandler<
      GetUserProfileByUsernameQuery,
      GetUserProfileByUsernameQueryResult
    >
{
  async handle(
    query: GetUserProfileByUsernameQuery,
  ): Promise<GetUserProfileByUsernameQueryResult> {
    const user = await db.query.User.findFirst({
      where: eq(schema.User.username, query.username),
      columns: {
        id: true,
        username: true,
        name: true,
      },
      with: {
        ProfileImage: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain -- i want to make this check explicit, username will always be defined but not set, this is to please the type checker
    if (!user || !user.username)
      return {
        user: null,
      };

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.ProfileImage,
      },
    };
  }
}
