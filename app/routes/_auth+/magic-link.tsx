import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '#app/modules/auth/auth.server'

import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/_auth+/login.js'

export const ROUTE_PATH = '/auth/magic-link' as const

export async function loader({ request }: LoaderFunctionArgs) {
	return authenticator.authenticate('TOTP', request, {
		successRedirect: '/',
		failureRedirect: LOGIN_PATH,
	})
}
