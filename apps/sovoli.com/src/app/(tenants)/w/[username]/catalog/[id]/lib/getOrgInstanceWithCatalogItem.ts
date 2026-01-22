import type { CatalogOffer } from "~/modules/catalogs/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";

export interface OrgInstanceWithCatalogItem {
  orgInstance: OrgInstance;
  catalogItem: CatalogOffer;
}

export async function getOrgInstanceWithCatalogItem(
  username: string,
  catalogItemId: string,
): Promise<OrgInstanceWithCatalogItem | null> {
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) {
    return null;
  }

  const catalogItem = orgInstance.catalogModule?.items.find(
    (item) => item.id === catalogItemId,
  );

  if (!catalogItem) {
    return null;
  }

  return {
    orgInstance,
    catalogItem,
  };
}
