import { bus } from "~/services/core/bus";
import {
  GetUserProfileByUsernameQuery,
  GetUserProfileByUsernameQueryHandler,
} from "~/services/users/queries/GetUserProfileByUsernameQuery";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserQueryPage(props: Props) {
  const params = await props.params;

  const result = await bus.queryProcessor.execute(
    new GetUserProfileByUsernameQuery(params.username),
  );

  const handler = new GetUserProfileByUsernameQueryHandler();
  const result1 = await handler.handle(
    new GetUserProfileByUsernameQuery(params.username),
  );

  return (
    <div>
      <h1>Bus: {result.user?.name}</h1>
      <h2>Handler: {result1.user?.name}</h2>
    </div>
  );
}
