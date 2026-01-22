"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import { Spinner } from "@sovoli/ui/components/spinner";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface TenantWithDomain {
  username: string;
  name: string;
  domain: string;
  url: string;
}

interface DomainStatus {
  tenant: TenantWithDomain;
  status: "checking" | "accessible" | "inaccessible" | "error";
  error?: string;
}

interface TenantListWithStatusProps {
  tenants: TenantWithDomain[];
}

interface CheckDomainResponse {
  accessible: boolean;
  status?: number | null;
  statusText?: string | null;
  error?: string;
  errorName?: string;
  isConnectionError?: boolean;
}

async function checkDomain(url: string): Promise<{
  accessible: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/admin/check-domain?url=${encodeURIComponent(url)}`,
    );

    if (!response.ok) {
      return {
        accessible: false,
        error: `API error: ${response.statusText}`,
      };
    }

    const data = (await response.json()) as CheckDomainResponse;

    if (data.accessible) {
      return { accessible: true };
    }

    // If not accessible, return error details
    const errorMessage =
      data.error ??
      (data.status
        ? `HTTP ${data.status}: ${data.statusText ?? "Not accessible"}`
        : "Not accessible");

    return {
      accessible: false,
      error: errorMessage,
    };
  } catch (error) {
    console.error(`Error checking domain ${url}:`, error);
    return {
      accessible: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function TenantListWithStatus({ tenants }: TenantListWithStatusProps) {
  const [statuses, setStatuses] = useState<DomainStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const stats = useMemo(() => {
    const accessible = statuses.filter((s) => s.status === "accessible").length;
    const inaccessible = statuses.filter(
      (s) => s.status === "inaccessible",
    ).length;
    const error = statuses.filter((s) => s.status === "error").length;
    const checking = statuses.filter((s) => s.status === "checking").length;
    return { accessible, inaccessible, error, checking };
  }, [statuses]);

  useEffect(() => {
    async function checkAllDomains() {
      setIsChecking(true);
      const initialStatuses: DomainStatus[] = tenants.map((tenant) => ({
        tenant,
        status: "checking",
      }));
      setStatuses(initialStatuses);

      const results: DomainStatus[] = [];

      for (const tenant of tenants) {
        const result = await checkDomain(tenant.url);
        results.push({
          tenant,
          status: result.accessible
            ? "accessible"
            : result.error
              ? "error"
              : "inaccessible",
          error: result.error,
        });

        // Update statuses progressively
        setStatuses([...results]);
      }

      setIsChecking(false);
    }

    void checkAllDomains();
  }, [tenants]);

  function getStatusIcon(status: DomainStatus["status"]) {
    switch (status) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "accessible":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "inaccessible":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-orange-500" />;
    }
  }

  // Create a map for quick status lookup
  const statusMap = new Map(statuses.map((s) => [s.tenant.username, s]));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {statuses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.accessible}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Accessible
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.inaccessible}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Inaccessible
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-900">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.error}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Errors
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.checking}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Checking
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {statuses.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Tenant List with Status */}
      <div className="space-y-3">
        {tenants.map((tenant) => {
          const domainStatus = statusMap.get(tenant.username);
          const status = domainStatus?.status ?? "checking";

          return (
            <Card key={tenant.username}>
              <CardBody className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {getStatusIcon(status)}
                      <h3 className="font-semibold truncate">{tenant.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate">@{tenant.username}</span>
                      <span>•</span>
                      <span className="truncate">{tenant.domain}</span>
                      <a
                        href={tenant.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    {domainStatus?.error && (
                      <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                        {domainStatus.error}
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Progress Indicator */}
      {isChecking && stats.checking > 0 && (
        <div className="text-center text-sm text-muted-foreground py-2">
          Checking {stats.checking} domain{stats.checking !== 1 ? "s" : ""}...
        </div>
      )}
    </div>
  );
}
