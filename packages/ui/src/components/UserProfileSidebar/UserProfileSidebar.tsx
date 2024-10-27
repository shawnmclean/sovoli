import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

export function UserProfileSidebar() {
  return (
    <div className="flex items-end gap-2">
      <div>
        <Badge
          placement="bottom-right"
          color="warning"
          content="1"
          shape="rectangle"
          showOutline
          title="Level 1"
        >
          <Avatar
            isBordered
            color="warning"
            radius="sm"
            className="h-20 w-20 text-large"
            src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z"
          />
        </Badge>
      </div>
      <div className="inline-flex flex-col items-start">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Passenger Available</span>
        </h1>
        <p className="text-sm">
          <span className="text-gray-500">Level 1</span>
        </p>
      </div>
    </div>
  );
}
