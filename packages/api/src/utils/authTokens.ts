import { createHash, randomBytes } from "crypto";

export const generateAuthToken = () => {
  return randomBytes(32).toString("hex");
};

export const hashAuthToken = (key: string) => {
  return createHash("sha256").update(key).digest("hex");
};
