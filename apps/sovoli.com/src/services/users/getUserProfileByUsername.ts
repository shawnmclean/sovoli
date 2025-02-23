import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import { eq, schema } from "@sovoli/db";

import { BaseService } from "../baseService";

export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  image: SelectMediaAssetSchema | null;
}

export interface GetUserProfileByUsernameOptions {
  username: string;
}

export interface GetUserProfileByUsernameResult {
  user?: UserProfile | null;
}

export class GetUserProfileByUsername extends BaseService<
  GetUserProfileByUsernameOptions,
  GetUserProfileByUsernameResult
> {
  constructor() {
    super("GetUserProfileByUsername");
  }

  async execute({ username }: GetUserProfileByUsernameOptions) {
    const user = await this.dbClient.query.User.findFirst({
      where: eq(schema.User.username, username),
      columns: {
        id: true,
        username: true,
        name: true,
        image: true,
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
