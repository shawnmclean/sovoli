"use server";

import { env } from "~/env";

export interface MetaApiError {
    error: {
        message: string;
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
        ...(params || {}),
    });
    url += `?${queryParams.toString()}`;

    const response = await fetch(url, { method });
    const data = await response.json();

    if (!response.ok) {
        const metaError = data as MetaApiError;
        throw new Error(
            metaError.error?.message ?? `Meta API Error: ${response.statusText}`,
        );
    }

    return data as T;
}

export async function getBusinessManagers(userAccessToken: string) {
    try {
        await metaApiRequest<{ data: { business?: { id: string; name: string } }[] }>("me/adaccounts", {
            accessToken: userAccessToken,
            params: { fields: "business" },
        });

        const businessesResponse = await metaApiRequest<{ data: { id: string; name: string; primary_page?: { id: string; name: string }; verification_status?: string }[] }>("me/businesses", {
            accessToken: userAccessToken,
            params: { fields: "id,name,primary_page,verification_status" },
        });

        return { status: "success", businesses: businessesResponse.data };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function setupOboConnection(
    clientBmId: string,
    userAccessToken: string,
) {
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

export async function createSystemUserAndToken(clientBmId: string) {
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

export async function fetchMetaAssets(clientSystemUserToken: string, clientBmId: string) {
    try {
        // Fetch pages owned by the Business Manager
        const pagesResponse = await metaApiRequest<{ data: { id: string; name: string; access_token?: string }[] }>(
            `${clientBmId}/owned_pages`,
            {
                accessToken: clientSystemUserToken,
                params: { fields: "id,name,access_token" }
            }
        );

        // Fetch ad accounts in the Business Manager
        const adAccountsResponse = await metaApiRequest<{ data: { id: string; name: string; account_id: string; currency: string }[] }>(
            `${clientBmId}/client_ad_accounts`,
            {
                accessToken: clientSystemUserToken,
                params: { fields: "id,name,account_id,currency" },
            },
        );

        return {
            status: "success",
            pages: pagesResponse.data ?? [],
            adAccounts: adAccountsResponse.data ?? [],
        };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getSystemUser(token: string): Promise<{ status: "success"; user: { id: string; name?: string } } | { status: "error"; message: string }> {
    try {
        const userResponse = await metaApiRequest<{ id: string; name?: string }>("me", {
            accessToken: token,
        });
        return { status: "success", user: userResponse };
    } catch (error: unknown) {
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
    }
}
