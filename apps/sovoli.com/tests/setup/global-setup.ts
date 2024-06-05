// import path from 'node:path'
// import { execaCommand } from 'execa'
// import fsExtra from 'fs-extra'



export async function setup() {
	// const databaseExists = await fsExtra.pathExists(BASE_DATABASE_PATH)

	// if (databaseExists) {
	// 	const databaseLastModifiedAt = (await fsExtra.stat(BASE_DATABASE_PATH))
	// 		.mtime
	// 	const prismaSchemaLastModifiedAt = (
	// 		await fsExtra.stat('./prisma/schema.prisma')
	// 	).mtime

	// 	if (prismaSchemaLastModifiedAt < databaseLastModifiedAt) {
	// 		return
	// 	}
	// }

	// await execaCommand(
	// 	'npx prisma migrate reset --force --skip-seed --skip-generate',
	// 	{
	// 		stdio: 'inherit',
	// 		env: {
	// 			...process.env,
	// 			DATABASE_URL: `${BASE_DATABASE_PATH}`,
	// 		},
	// 	},
	// )
}
