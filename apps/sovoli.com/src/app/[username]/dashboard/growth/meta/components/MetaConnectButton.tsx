"use client";

import { useEffect, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { FacebookIcon, Loader2 } from "lucide-react";
import { Spinner } from "@sovoli/ui/components/spinner";

interface MetaConnectButtonProps {
    onConnected: (token: string) => void;
    appId: string;
}

export function MetaConnectButton({ onConnected, appId }: MetaConnectButtonProps) {
    const [isConnecting, setIsConnecting] = useState(false);

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

        const redirectUri = window.location.origin + window.location.pathname;
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

        // Poll the popup for the token
        const pollTimer = setInterval(() => {
            try {
                if (popup && popup.closed) {
                    clearInterval(pollTimer);
                    setIsConnecting(false);
                    return;
                }

                if (popup && popup.location.hash.includes("access_token=")) {
                    const token = new URLSearchParams(popup.location.hash.substring(1)).get("access_token");
                    if (token) {
                        clearInterval(pollTimer);
                        popup.close();
                        onConnected(token);
                        setIsConnecting(false);
                    }
                }
            } catch (e) {
                // Cross-origin errors are expected until redirect back to same origin
            }
        }, 500);
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
