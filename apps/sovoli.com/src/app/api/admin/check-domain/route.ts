import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{ error: "URL parameter is required" },
			{ status: 400 },
		);
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		// Try HEAD request first (lighter)
		try {
			const response = await fetch(url, {
				method: "HEAD",
				signal: controller.signal,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (compatible; SovoliBot/1.0; +https://sovoli.com)",
				},
				redirect: "follow",
			});

			clearTimeout(timeoutId);

			return NextResponse.json({
				accessible: response.ok,
				status: response.status,
				statusText: response.statusText,
			});
		} catch (headError) {
			clearTimeout(timeoutId);

			// If HEAD fails, try GET request
			const getController = new AbortController();
			const getTimeoutId = setTimeout(() => getController.abort(), 10000);

			try {
				const response = await fetch(url, {
					method: "GET",
					signal: getController.signal,
					headers: {
						"User-Agent":
							"Mozilla/5.0 (compatible; SovoliBot/1.0; +https://sovoli.com)",
					},
					redirect: "follow",
				});

				clearTimeout(getTimeoutId);

				return NextResponse.json({
					accessible: response.ok,
					status: response.status,
					statusText: response.statusText,
				});
			} catch (getError) {
				clearTimeout(getTimeoutId);

				// Build detailed error message
				let errorMessage = "Network error";
				let errorName = "NetworkError";

				if (getError instanceof Error) {
					errorName = getError.name;
					if (getError.name === "AbortError") {
						errorMessage = "Request timeout";
					} else if (getError.message) {
						errorMessage = getError.message;
					}
				}

				// Check if it's a DNS/connection error vs other error
				const isConnectionError =
					errorMessage.includes("ENOTFOUND") ||
					errorMessage.includes("ECONNREFUSED") ||
					errorMessage.includes("getaddrinfo") ||
					errorName === "TypeError";

				return NextResponse.json({
					accessible: false,
					status: null,
					statusText: null,
					error: errorMessage,
					errorName,
					isConnectionError,
				});
			}
		}
	} catch (error) {
		let errorMessage = "Unknown error";
		let errorName = "UnknownError";

		if (error instanceof Error) {
			errorName = error.name;
			errorMessage = error.message;
		}

		return NextResponse.json({
			accessible: false,
			error: errorMessage,
			errorName,
		});
	}
}

