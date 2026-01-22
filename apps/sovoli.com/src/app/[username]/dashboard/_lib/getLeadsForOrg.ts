import { parseLeadsModule } from "~/modules/data/organisations/utils/parseLeadsModule";
// Scrappy: we only have JSON leads for the pilot tenant right now.
import healingEmeraldLeadsData from "~/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json";
import type { Lead } from "~/modules/leads/types";

export function isLeadsConfiguredForOrg(username: string): boolean {
  return username === "healingemeraldwellness";
}

export function getLeadsForOrg(username: string): Lead[] {
  if (!isLeadsConfiguredForOrg(username)) return [];

  const leadsModule = parseLeadsModule(healingEmeraldLeadsData);
  return leadsModule.leads;
}
