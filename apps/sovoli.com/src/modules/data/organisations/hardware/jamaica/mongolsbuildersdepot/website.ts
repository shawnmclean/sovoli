import type { WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN } from "./constants";

export const MONGOLS_BUILDERS_DEPOT_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Mongol's Builders Depot",
    title: "Hardware - Mongol's Builders Depot",
    description:
      "Mongol's Builders Depot provides quality hardware in Linstead, Jamaica. Your trusted partner for all hardware needs.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [],
    pages: [],
  },
};
