// /app/(landing)/actions/schemas.ts

import { z } from "zod";

export const formInsertWaitlistContactSchema = z.object({
  mode: z.enum(["whatsapp", "email", "phone"]),
  contactValue: z.string().min(3, "Contact value is required"),
});
