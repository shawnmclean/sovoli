"use server";

import { env } from "~/env";

interface MetaPage {
    id: string;
    name: string;
    access_token?: string;
}

interface MetaAdAccount {
    id: string;
    name: string;
    account_id: string;
    currency: string;
}

interface MetaBusiness {
    id: string;
    name: string;
    primary_page?: { id: string; name: string };
    verification_status?: string;
}

interface ApiSuccessBase {
    status: "success";
}

interface ApiError {
    status: "error";
    message: string;
}

interface MetaAssetsSuccess extends ApiSuccessBase {
    pages: MetaPage[];
    adAccounts: MetaAdAccount[];
}

interface BusinessManagersSuccess extends ApiSuccessBase {
    businesses: MetaBusiness[];
}

interface SystemUserSuccess extends ApiSuccessBase {
    token: string;
    systemUserId: string;
    systemUserName?: string;
}

interface AdAccountSuccess extends ApiSuccessBase {
    adAccountId: string;
}

interface SystemUserLookupSuccess extends ApiSuccessBase {
    user: { id: string; name?: string };
}

export interface MetaApiError {
    error: {
        message?: string;
        type: string;
        code: number;
        error_subcode?: number;
        fbtrace_id?: string;
        error_user_title?: string;
        error_user_msg?: string;
    };
}

async function metaApiRequest<T>(
    endpoint: string,
    options: {
        method?: "GET" | "POST" | "DELETE";
        accessToken: string;
        apiVersion?: string;
        params?: Record<string, string>;
    },
): Promise<T> {
    const {
        method = "GET",
        accessToken,
        apiVersion = "v24.0",
        params,
    } = options;

    let url = `https://graph.facebook.com/${apiVersion}/${endpoint}`;
    const queryParams = new URLSearchParams({
        access_token: accessToken,
        ...(params ?? {}),
    });
    url += `?${queryParams.toString()}`;

    const response = await fetch(url, { method });
    const data = (await response.json()) as unknown;

    if (!response.ok) {
        const metaError = data as MetaApiError;
        throw new Error(
            metaError.error.message ?? `Meta API Error: ${response.statusText}`,
        );
    }

    return data as T;
}

export async function getBusinessManagers(userAccessToken: string): Promise<BusinessManagersSuccess | ApiError> {
    try {
        await metaApiRequest<{ data: { business?: { id: string; name: string } }[] }>("me/adaccounts", {
            accessToken: userAccessToken,
            params: { fields: "business" },
        });

        const businessesResponse = await metaApiRequest<{ data?: MetaBusiness[] }>("me/businesses", {
            accessToken: userAccessToken,
            params: { fields: "id,name,primary_page,verification_status" },
        });

        return { status: "success", businesses: businessesResponse.data ?? [] };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function setupOboConnection(
    clientBmId: string,
    userAccessToken: string,
): Promise<ApiSuccessBase | ApiError> {
    try {
        const partnerBmId = env.META_PARTNER_BM_ID;
        if (!partnerBmId) throw new Error("META_PARTNER_BM_ID not configured");

        await metaApiRequest(`${partnerBmId}/managed_businesses`, {
            method: "POST",
            accessToken: userAccessToken,
            params: { existing_client_business_id: clientBmId },
        });

        return { status: "success" };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function createSystemUserAndToken(clientBmId: string): Promise<SystemUserSuccess | ApiError> {
    try {
        const partnerSystemUserToken = env.PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN ?? env.META_PARTNER_SYSTEM_USER_TOKEN;
        const appId = env.META_APP_ID;

        if (!partnerSystemUserToken) throw new Error("Partner system user token not configured");
        if (!appId) throw new Error("META_APP_ID not configured");

        const tokenResponse = await metaApiRequest<{ access_token: string }>(
            `${clientBmId}/access_token`,
            {
                method: "POST",
                accessToken: partnerSystemUserToken,
                params: {
                    scope: "ads_management,pages_read_engagement,business_management,pages_show_list",
                    app_id: appId,
                },
            },
        );

        const userResponse = await metaApiRequest<{ id: string; name?: string }>("me", {
            accessToken: tokenResponse.access_token,
        });

        return {
            status: "success",
            token: tokenResponse.access_token,
            systemUserId: userResponse.id,
            systemUserName: userResponse.name,
        };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function fetchMetaAssets(clientSystemUserToken: string, clientBmId: string): Promise<MetaAssetsSuccess | ApiError> {
    try {
        // Fetch pages owned by the Business Manager
        const pagesResponse = await metaApiRequest<{ data?: MetaPage[] }>(
            `${clientBmId}/owned_pages`,
            {
                accessToken: clientSystemUserToken,
                params: { fields: "id,name,access_token" }
            }
        );

        // Fetch ad accounts - check both client and owned, plus 'me/adaccounts' for the system user
        const clientAdAccounts = await metaApiRequest<{ data?: MetaAdAccount[] }>(
            `${clientBmId}/client_ad_accounts`,
            {
                accessToken: clientSystemUserToken,
                params: { fields: "id,name,account_id,currency" },
            },
        );

        const ownedAdAccounts = await metaApiRequest<{ data?: MetaAdAccount[] }>(
            `${clientBmId}/owned_ad_accounts`,
            {
                accessToken: clientSystemUserToken,
                params: { fields: "id,name,account_id,currency" },
            },
        );

        const meAdAccounts = await metaApiRequest<{ data?: MetaAdAccount[] }>(
            "me/adaccounts",
            {
                accessToken: clientSystemUserToken,
                params: { fields: "id,name,account_id,currency" },
            },
        );

        // Merge and deduplicate ad accounts
        const adAccountMap = new Map<string, MetaAdAccount>();
        [
            ...(clientAdAccounts.data ?? []),
            ...(ownedAdAccounts.data ?? []),
            ...(meAdAccounts.data ?? [])
        ].forEach(acc => {
            adAccountMap.set(acc.id, acc);
        });

        return {
            status: "success",
            pages: pagesResponse.data ?? [],
            adAccounts: Array.from(adAccountMap.values()),
        };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getSystemUser(token: string): Promise<SystemUserLookupSuccess | ApiError> {
    try {
        const userResponse = await metaApiRequest<{ id: string; name?: string }>("me", {
            accessToken: token,
        });
        return { status: "success", user: userResponse };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function createMetaAdAccount(params: {
    businessId: string;
    name: string;
    currency: string;
    timezoneId: number;
    accessToken: string;
    assignToUserId?: string; // Optional: system user to assign to
}): Promise<AdAccountSuccess | ApiError> {
    try {
        const result = await metaApiRequest<{ id: string }>(`${params.businessId}/adaccount`, {
            method: "POST",
            accessToken: params.accessToken,
            params: {
                name: params.name,
                currency: params.currency,
                timezone_id: params.timezoneId.toString(),
                end_advertiser: params.businessId,
                media_agency: "NONE",
                partner: "NONE",
            },
        });

        const adAccountId = result.id.replace("act_", "");

        // If a system user ID is provided, assign them immediately
        if (params.assignToUserId) {
            await assignAssetToSystemUser({
                assetId: adAccountId,
                systemUserId: params.assignToUserId,
                userAccessToken: params.accessToken,
                assetType: "AD_ACCOUNT",
            });
        }

        return { status: "success", adAccountId };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function assignAssetToSystemUser(params: {
    assetId: string;
    systemUserId: string;
    userAccessToken: string;
    assetType: "PAGE" | "AD_ACCOUNT";
}): Promise<ApiSuccessBase | ApiError> {
    try {
        const tasks = "MANAGE,ADVERTISE,ANALYZE";
        const endpoint = params.assetType === "AD_ACCOUNT"
            ? (params.assetId.startsWith("act_") ? params.assetId : `act_${params.assetId}`)
            : params.assetId;

        await metaApiRequest<{ success: boolean }>(`${endpoint}/assigned_users`, {
            method: "POST",
            accessToken: params.userAccessToken,
            params: {
                user: params.systemUserId,
                tasks,
            },
        });
        return { status: "success" };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function fetchBusinessAssets(businessId: string, userAccessToken: string): Promise<MetaAssetsSuccess | ApiError> {
    try {
        // Fetch pages owned by the Business Manager
        const pagesResponse = await metaApiRequest<{ data?: MetaPage[] }>(`${businessId}/owned_pages`, {
            accessToken: userAccessToken,
            params: { fields: "id,name" },
        });

        // Fetch ad accounts - trying both client_ad_accounts and owned_ad_accounts to be thorough
        const clientAdAccounts = await metaApiRequest<{ data?: MetaAdAccount[] }>(`${businessId}/client_ad_accounts`, {
            accessToken: userAccessToken,
            params: { fields: "id,name,account_id,currency" },
        });

        const ownedAdAccounts = await metaApiRequest<{ data?: MetaAdAccount[] }>(`${businessId}/owned_ad_accounts`, {
            accessToken: userAccessToken,
            params: { fields: "id,name,account_id,currency" },
        });

        // Merge and deduplicate ad accounts
        const adAccountMap = new Map<string, MetaAdAccount>();
        [...(clientAdAccounts.data ?? []), ...(ownedAdAccounts.data ?? [])].forEach(acc => {
            adAccountMap.set(acc.id, acc);
        });

        return {
            status: "success",
            pages: pagesResponse.data ?? [],
            adAccounts: Array.from(adAccountMap.values()),
        };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}
