"use client";

import { useEffect, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { FacebookIcon } from "lucide-react";
import { Spinner } from "@sovoli/ui/components/spinner";

interface MetaConnectButtonProps {
    onConnected: (token: string) => void;
    appId: string;
}

export function MetaConnectButton({ onConnected, appId }: MetaConnectButtonProps) {
    const [isConnecting, setIsConnecting] = useState(false);

    const isMetaOauthMessage = (
        data: unknown,
    ): data is { type: "META_OAUTH_TOKEN"; token: string } | { type: "META_OAUTH_ERROR"; error: string } => {
        if (!data || typeof data !== "object") return false;
        const record = data as Record<string, unknown>;
        if (record.type === "META_OAUTH_TOKEN") {
            return typeof record.token === "string";
        }
        if (record.type === "META_OAUTH_ERROR") {
            return typeof record.error === "string";
        }
        return false;
    };

    useEffect(() => {
        // Handle the redirect back from FB if it happens in the same window (unlikely with popup)
        const hash = window.location.hash;
        if (hash.includes("access_token=")) {
            const token = new URLSearchParams(hash.substring(1)).get("access_token");
            if (token) {
                onConnected(token);
            }
        }
    }, [onConnected]);

    const handleConnect = () => {
        setIsConnecting(true);

        const redirectUri = window.location.origin + "/meta-callback";
        const scope = "ads_management,pages_read_engagement,business_management,pages_show_list,public_profile";
        const authUrl = `https://www.facebook.com/v24.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=${encodeURIComponent(scope)}&response_type=token`;

        // Open in a popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            authUrl,
            "facebook-login",
            `width=${width},height=${height},left=${left},top=${top}`
        );

        // Listen for message from the callback page
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (!isMetaOauthMessage(event.data)) return;

            if (event.data.type === "META_OAUTH_TOKEN") {
                onConnected(event.data.token);
                setIsConnecting(false);
                window.removeEventListener("message", handleMessage);
            } else {
                console.error("Meta Auth Error:", event.data.error);
                setIsConnecting(false);
                window.removeEventListener("message", handleMessage);
            }
        };

        window.addEventListener("message", handleMessage);

        // Cleanup if popup is closed manually
        const checkClosed = setInterval(() => {
            if (popup?.closed) {
                clearInterval(checkClosed);
                setIsConnecting(false);
                window.removeEventListener("message", handleMessage);
            }
        }, 1000);
    };

    return (
        <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? (
                <Spinner size="sm" color="current" className="mr-2" />
            ) : (
                <FacebookIcon className="mr-2 h-4 w-4" />
            )}
            Connect with Facebook
        </Button>
    );
}
