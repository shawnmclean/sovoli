import { sendWhatsAppMessage } from '#app/modules/whatsapp/whatsapp.server'
type AuthPhoneMessageOptions = {
	email: string
	code: string
	magicLink?: string | null
}

export async function sendAuthMessage({
	email,
	code,
	magicLink,
}: AuthPhoneMessageOptions) {
	// const html = renderAuthEmailEmail({ email, code, magicLink })
	await sendWhatsAppMessage({
		to: email,
		subject: 'Your login code for Remix Auth TOTP',
		html: '',
	})
}
