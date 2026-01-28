"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Spinner } from "@sovoli/ui/components/spinner";
import { AlertCircle } from "lucide-react";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { MetaConnectButton } from "./components/MetaConnectButton";
import { BusinessManagerList } from "./components/BusinessManagerList";
import { AssetDisplay } from "./components/AssetDisplay";
import {
    getBusinessManagers,
    setupOboConnection,
    createSystemUserAndToken,
    fetchMetaAssets,
    getSystemUser
} from "./actions";

// For demo purposes, we'll get the App ID from an env or hardcode if missing
const META_APP_ID = "4067035073542160";

type Step = "connect" | "select-bm" | "setting-up" | "completed";

export default function MetaOboPage() {
    const { username } = useParams<{ username: string }>();
    const [step, setStep] = useState<Step>("connect");
    const [userToken, setUserToken] = useState("");
    const [businesses, setBusinesses] = useState<{ id: string; name: string; primary_page?: { id: string; name: string }; verification_status?: string }[]>([]);
    const [selectedBmId, setSelectedBmId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [directToken, setDirectToken] = useState("");
    const [directBmId, setDirectBmId] = useState("");

    const [setupResult, setSetupResult] = useState<{
        systemUser: {
            id: string;
            token: string;
            name?: string;
        };
        businessId: string;
        pages: { id: string; name: string; access_token?: string }[];
        adAccounts: { id: string; name: string; account_id: string; currency: string }[];
    } | null>(null);

    const handleConnected = async (token: string) => {
        setUserToken(token);
        setStep("select-bm");
        setIsLoading(true);
        setError(null);

        const result = await getBusinessManagers(token);
        if (result.status === "success") {
            setBusinesses(result.businesses ?? []);
        } else {
            setError(result.message ?? "Failed to fetch Business Managers");
        }
        setIsLoading(false);
    };

    const handleSelectBm = async (bmId: string) => {
        setSelectedBmId(bmId);
        setStep("setting-up");
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Setup OBO relationship
            const oboResult = await setupOboConnection(bmId, userToken);
            if (oboResult.status === "error") throw new Error(oboResult.message);

            // Step 2: Create System User
            const suResult = await createSystemUserAndToken(bmId);
            if (suResult.status === "error") throw new Error(suResult.message);

            // Step 3: Fetch Assets
            const assetsResult = await fetchMetaAssets(suResult.token || "", bmId);
            if (assetsResult.status === "error") throw new Error(assetsResult.message);

            setSetupResult({
                systemUser: {
                    id: suResult.systemUserId ?? "",
                    token: suResult.token ?? "",
                    name: suResult.systemUserName,
                },
                businessId: bmId,
                pages: assetsResult.pages ?? [],
                adAccounts: assetsResult.adAccounts ?? [],
            });
            setStep("completed");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred during setup");
            setStep("select-bm");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectConnect = async () => {
        if (!directToken || !directBmId) {
            setError("Please provide both context and token");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Validate Token & Get User
            const userResult = await getSystemUser(directToken);
            if (userResult.status === "error") throw new Error(userResult.message);

            // Step 2: Fetch Assets
            const assetsResult = await fetchMetaAssets(directToken, directBmId);
            if (assetsResult.status === "error") throw new Error(assetsResult.message);

            setSetupResult({
                systemUser: {
                    id: userResult.user.id,
                    token: directToken,
                    name: userResult.user.name,
                },
                businessId: directBmId,
                pages: assetsResult.pages ?? [],
                adAccounts: assetsResult.adAccounts ?? [],
            });
            setStep("completed");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred during direct connection");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meta Business Integration</h1>
                <p className="text-muted-foreground">
                    Connect your Meta Business Manager to enable automated ad management for {username}.
                </p>
            </div>

            {error && (
                <Card className="border-danger bg-danger/10">
                    <CardBody className="pt-6 flex items-center gap-3 text-danger">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </CardBody>
                </Card>
            )}

            {step === "connect" && (
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-col items-start gap-1 p-6 pb-0">
                            <h3 className="text-lg font-bold">Option 1: OAuth Flow</h3>
                            <p className="text-sm text-muted-foreground">
                                Login with your Facebook account that has admin access to your Business Manager.
                            </p>
                        </CardHeader>
                        <CardBody className="flex justify-center py-8">
                            <MetaConnectButton appId={META_APP_ID} onConnected={handleConnected} />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col items-start gap-1 p-6 pb-0">
                            <h3 className="text-lg font-bold">Option 2: Direct Token</h3>
                            <p className="text-sm text-muted-foreground">
                                Paste a System User Access Token and Business ID directly if you have them.
                            </p>
                        </CardHeader>
                        <CardBody className="space-y-4 py-8">
                            <Input
                                label="System User Token"
                                placeholder="EAA..."
                                value={directToken}
                                onValueChange={setDirectToken}
                            />
                            <Input
                                label="Meta Business ID"
                                placeholder="1234..."
                                value={directBmId}
                                onValueChange={setDirectBmId}
                            />
                            <Button
                                color="primary"
                                className="w-full"
                                isLoading={isLoading}
                                onClick={handleDirectConnect}
                                disabled={!directToken || !directBmId}
                            >
                                Connect Directly
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            )}

            {step === "select-bm" && (
                <BusinessManagerList
                    businesses={businesses}
                    onSelect={handleSelectBm}
                    isLoading={isLoading}
                />
            )}

            {step === "setting-up" && (
                <Card>
                    <CardBody className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Spinner size="lg" color="primary" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Setting up On Behalf Of connection...</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Creating system user and fetching assets from Meta.
                            </p>
                        </div>
                    </CardBody>
                </Card>
            )}

            {step === "completed" && setupResult && (
                <AssetDisplay
                    systemUser={setupResult.systemUser}
                    businessId={setupResult.businessId}
                    pages={setupResult.pages}
                    adAccounts={setupResult.adAccounts}
                />
            )}
        </div>
    );
}
