import type { SecurityRequirementObject } from "openapi3-ts/oas30";
import { upgrade } from "@scalar/openapi-parser";
import { contract } from "@sovoli/core/tsr/contract";
import { getBaseUrl } from "@sovoli/core/utils";
import { generateOpenApi } from "@ts-rest/open-api";

const hasCustomTags = (
  metadata: unknown,
): metadata is { openApiTags: string[] } => {
  return (
    !!metadata && typeof metadata === "object" && "openApiTags" in metadata
  );
};

const hasSecurity = (
  metadata: unknown,
): metadata is { openApiSecurity: SecurityRequirementObject[] } => {
  return (
    !!metadata && typeof metadata === "object" && "openApiSecurity" in metadata
  );
};

const tsrOpenApiSpec = generateOpenApi(
  contract,
  {
    info: {
      title: "Sovoli API",
      version: "1.0.0",
    },
    components: {
      schemas: {},
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "API Key",
        },
      },
    },
  },
  {
    setOperationId: true,
    operationMapper: (operation, appRoute) => ({
      ...operation,
      ...(hasCustomTags(appRoute.metadata)
        ? {
            tags: appRoute.metadata.openApiTags,
          }
        : {}),
      ...(hasSecurity(appRoute.metadata)
        ? {
            security: appRoute.metadata.openApiSecurity,
          }
        : {}),
    }),
  },
);
tsrOpenApiSpec.servers = [
  {
    url: `${getBaseUrl()}/api/v1`,
    description: "Sovoli API",
  },
];

const { specification } = upgrade(tsrOpenApiSpec);

export { specification };
