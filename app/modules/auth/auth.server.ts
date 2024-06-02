import { type User } from '@prisma/client'
import { redirect } from '@remix-run/node'
import { Authenticator } from 'remix-auth'
import { TOTPStrategy } from 'remix-auth-totp'
import { authSessionStorage } from '#app/modules/auth/auth-session.server'
import { sendAuthMessage } from '#app/modules/whatsapp/templates/auth-message'
import { ROUTE_PATH as LOGOUT_PATH } from '#app/routes/_auth+/logout.js'
import { ROUTE_PATH as MAGIC_LINK_PATH } from '#app/routes/_auth+/magic-link.js'
import { ERRORS } from '#app/utils/constants/errors'
import { prisma } from '#app/utils/db.server'

export const authenticator = new Authenticator<User>(authSessionStorage)

/**
 * TOTP - Strategy.
 */
authenticator.use(
	new TOTPStrategy(
		{
			secret: process.env.ENCRYPTION_SECRET || 'NOT_A_STRONG_SECRET',
			magicLinkPath: MAGIC_LINK_PATH,
			sendTOTP: async ({ email, code, magicLink }) => {
				if (process.env.NODE_ENV === 'development') {
					// Development Only: Log the TOTP code.
					console.log('[ Dev-Only ] TOTP Code:', code)

					// Email is not sent for admin users.
					if (email.startsWith('admin')) {
						console.log('Not sending email for admin user.')
						return
					}
				}
				await sendAuthMessage({ email, code, magicLink })
			},
		},
		async ({ email }) => {
			// let user = await prisma.user.findUnique({
			// 	where: { email },
			// 	include: {
			// 		image: { select: { id: true } },
			// 		roles: { select: { name: true } },
			// 	},
			// })
			let user = null
			if (!user) {
				// user = await prisma.user.create({
				// 	data: {
				// 		email,
				// 	},
				// 	include: {
				// 		image: { select: { id: true } },
				// 		roles: {
				// 			select: {
				// 				name: true,
				// 			},
				// 		},
				// 	},
				// })
				if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED)
			}

			return user
		},
	),
)

/**
 * Utilities.
 */
export async function requireSessionUser(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const sessionUser = await authenticator.isAuthenticated(request)
	if (!sessionUser) {
		if (!redirectTo) throw redirect(LOGOUT_PATH)
		else throw redirect(redirectTo)
	}
	return sessionUser
}

export async function requireUser(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const sessionUser = await authenticator.isAuthenticated(request)
	const user = sessionUser?.id
		? await prisma.user.findUnique({
				where: { id: sessionUser?.id },
			})
		: null
	if (!user) {
		if (!redirectTo) throw redirect(LOGOUT_PATH)
		else throw redirect(redirectTo)
	}
	return user
}
