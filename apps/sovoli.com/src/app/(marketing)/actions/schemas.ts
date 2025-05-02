import { z } from "zod";

export const formInsertWaitlistContactSchema = z.object({
  contactMode: z.enum(["whatsapp", "email", "phone"]),
  contactValue: z.string().min(3, "Contact value is required"),
});
