import type { OrgInstance } from "~/modules/organisations/types";
import type { WebsiteModule } from "~/modules/websites/types";

export type OrgInstanceWithWebsite = Omit<OrgInstance, "websiteModule"> & {
  websiteModule: WebsiteModule;
};
