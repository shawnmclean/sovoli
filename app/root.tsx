import {
	type MetaFunction,
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'

import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { useToast } from '#app/components/toaster'
import { Toaster } from '#app/components/ui/sonner'
import { authenticator } from '#app/modules/auth/auth.server'
import { siteConfig } from '#app/utils/constants/brand'
import { csrf } from '#app/utils/csrf.server'
import { prisma } from '#app/utils/db.server'
import { honeypot } from '#app/utils/honeypot.server'
import { getHints } from '#app/utils/hooks/use-hints'

import { useNonce } from '#app/utils/hooks/use-nonce'
import { getTheme, useTheme, type Theme } from '#app/utils/hooks/use-theme'
import { combineHeaders, getDomainUrl } from '#app/utils/misc.server'
import { getToastSession } from '#app/utils/toast.server'
import RootCSS from './root.css?url'

export const handle = { i18n: ['translation'] }

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: data
				? `${siteConfig.siteTitle}`
				: `Error | ${siteConfig.siteTitle}`,
		},
		{
			name: 'description',
			content: siteConfig.siteDescription,
		},
	]
}

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: RootCSS }]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const sessionUser = await authenticator.isAuthenticated(request)
	const user = sessionUser?.id
		? await prisma.user.findUnique({
				where: { id: sessionUser?.id },
				include: {
					image: { select: { id: true } },
					roles: { select: { name: true } },
				},
			})
		: null

	const { toast, headers: toastHeaders } = await getToastSession(request)
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken()

	return json(
		{
			user,
			toast,
			csrfToken,
			honeypotProps: honeypot.getInputProps(),
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: { theme: getTheme(request) },
			},
		} as const,
		{
			headers: combineHeaders(
				toastHeaders,
				csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null,
			),
		},
	)
}
function Document({
	children,
	nonce,
	lang = 'en',
	dir = 'ltr',
	theme = 'light',
}: {
	children: React.ReactNode
	nonce: string
	lang?: string
	dir?: 'ltr' | 'rtl'
	theme?: Theme
}) {
	return (
		<html
			lang={lang}
			dir={dir}
			className={`${theme} overflow-x-hidden`}
			style={{ colorScheme: theme }}
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-auto w-full">
				{children}
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<Toaster closeButton position="bottom-center" theme={theme} />
			</body>
		</html>
	)
}

export default function AppWithProviders() {
	const { toast, csrfToken, honeypotProps } = useLoaderData<typeof loader>()

	const nonce = useNonce()
	const theme = useTheme()

	// Renders toast (if any).
	useToast(toast)

	return (
		<Document nonce={nonce} theme={theme} lang="en">
			<AuthenticityTokenProvider token={csrfToken}>
				<HoneypotProvider {...honeypotProps}>
					<Outlet />
				</HoneypotProvider>
			</AuthenticityTokenProvider>
		</Document>
	)
}

export function ErrorBoundary() {
	const nonce = useNonce()
	const theme = useTheme()

	return (
		<Document nonce={nonce} theme={theme}>
			<GeneralErrorBoundary
				statusHandlers={{
					403: ({ error }) => (
						<p>You are not allowed to do that: {error?.data.message}</p>
					),
				}}
			/>
		</Document>
	)
}
