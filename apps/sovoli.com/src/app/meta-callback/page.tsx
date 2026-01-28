"use client";

import { useEffect } from "react";
import { Spinner } from "@sovoli/ui/components/spinner";

export default function MetaCallbackPage() {
    useEffect(() => {
        // Facebook sends the token in the hash (fragment) when response_type=token
        const hash = window.location.hash;
        if (hash.includes("access_token=")) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get("access_token");

            if (token && window.opener) {
                // Send the token back to the main dashboard window
                window.opener.postMessage({ type: "META_OAUTH_TOKEN", token }, window.location.origin);
                window.close();
            }
        } else if (hash.includes("error=")) {
            const params = new URLSearchParams(hash.substring(1));
            const error = params.get("error_description") || "Authentication failed";

            if (window.opener) {
                window.opener.postMessage({ type: "META_OAUTH_ERROR", error }, window.location.origin);
                window.close();
            }
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
            <Spinner size="lg" color="primary" />
            <div className="text-center">
                <h3 className="text-lg font-semibold">Authenticating with Meta...</h3>
                <p className="text-sm text-muted-foreground">This window will close automatically.</p>
            </div>
        </div>
    );
}
