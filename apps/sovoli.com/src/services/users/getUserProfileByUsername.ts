import { eq, schema } from "@sovoli/db";

import { BaseService } from "../baseService";

export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
}

export interface GetUserProfileByUsernameOptions {
  username: string;
}

export class GetUserProfileByUsername extends BaseService<
  GetUserProfileByUsernameOptions,
  UserProfile | null
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
    });

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain -- i want to make this check explicit, username will always be defined, this is to please the type checker
    if (!user || !user.username) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
    };
  }
}
