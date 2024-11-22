import { createClient } from "@supabase/supabase-js";
import { task } from "@trigger.dev/sdk/v3";

import { env } from "../env";

export const test = task({
  id: "test",
  run: async (_) => {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

    const { error } = await supabase.storage
      .from(env.SUPABASE_MEDIA_BUCKET)
      .remove(["ae5a2f95-ed0a-4715-a862-27538693c6bb.jpeg"]);

    if (error) {
      throw new Error(`Supabase remove error: ${error.message}`);
    }
  },
});
