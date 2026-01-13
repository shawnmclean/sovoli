import inquirer from "inquirer";
import type { MatchedOrg, MatchedProgram } from "../validation/schemas/lead-extraction-schema.js";

/**
 * Prompt user to select an organization action
 */
export async function promptOrgAction(
	matchedOrgs: MatchedOrg[] | null,
	businessName: string,
): Promise<"use" | "create" | "skip"> {
	if (matchedOrgs && matchedOrgs.length > 0) {
		// Show matched orgs
		console.log(`\n📋 Business: ${businessName}`);
		console.log("\nMatched Organizations:");
		for (let i = 0; i < matchedOrgs.length; i++) {
			const org = matchedOrgs[i];
			if (!org) continue;
			console.log(
				`  ${i + 1}. ${org.name} (${org.id}) - Score: ${org.score.toFixed(2)}`,
			);
			if (org.address) {
				console.log(`     Address: ${org.address}`);
			}
		}

		const { action } = await inquirer.prompt<{ action: string }>([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [
					{ name: "Use existing organization", value: "use" },
					{ name: "Create new organization", value: "create" },
					{ name: "Skip this extraction", value: "skip" },
				],
			},
		]);

		return action as "use" | "create" | "skip";
	} else {
		// No matches, ask to create or skip
		console.log(`\n📋 Business: ${businessName}`);
		console.log("No matching organizations found.");

		const { action } = await inquirer.prompt<{ action: string }>([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [
					{ name: "Create new organization", value: "create" },
					{ name: "Skip this extraction", value: "skip" },
				],
			},
		]);

		return action as "create" | "skip";
	}
}

/**
 * Prompt user to select which matched org to use
 */
export async function promptSelectOrg(
	matchedOrgs: MatchedOrg[],
): Promise<MatchedOrg | null> {
	if (matchedOrgs.length === 1) {
		return matchedOrgs[0]!;
	}

	const choices = matchedOrgs.map((org, index) => ({
		name: `${org.name} (${org.id}) - Score: ${org.score.toFixed(2)}${org.address ? ` - ${org.address}` : ""}`,
		value: index,
	}));

	const { selectedIndex } = await inquirer.prompt<{ selectedIndex: number }>([
		{
			type: "list",
			name: "selectedIndex",
			message: "Select organization to update:",
			choices,
		},
	]);

	return matchedOrgs[selectedIndex] || null;
}

/**
 * Prompt for new org details
 */
export async function promptNewOrgDetails(businessName: string): Promise<{
	category: string;
	country: string;
	region?: string;
	username: string;
}> {
	const { category } = await inquirer.prompt<{ category: string }>([
		{
			type: "list",
			name: "category",
			message: "Select organization category:",
			choices: [
				"beauty-school",
				"private-school",
				"public-school",
				"vocational-school",
				"fashion-school",
				"music-school",
				"fitness-school",
				"other",
			],
		},
	]);

	const { country } = await inquirer.prompt<{ country: string }>([
		{
			type: "list",
			name: "country",
			message: "Select country:",
			choices: ["JM", "GY", "BB", "TT", "other"],
		},
	]);

	const { hasRegion } = await inquirer.prompt<{ hasRegion: boolean }>([
		{
			type: "confirm",
			name: "hasRegion",
			message: "Does this organization have a region/state?",
			default: false,
		},
	]);

	let region: string | undefined;
	if (hasRegion) {
		const { regionInput } = await inquirer.prompt<{ regionInput: string }>([
			{
				type: "input",
				name: "regionInput",
				message: "Enter region/state (e.g., st-elizabeth):",
			},
		]);
		region = regionInput.trim() || undefined;
	}

	// Generate username from business name
	const defaultUsername = businessName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.substring(0, 50);

	const { username } = await inquirer.prompt<{ username: string }>([
		{
			type: "input",
			name: "username",
			message: "Enter organization username (slug):",
			default: defaultUsername,
			validate: (input: string) => {
				if (!input || input.trim().length === 0) {
					return "Username is required";
				}
				if (!/^[a-z0-9-]+$/.test(input)) {
					return "Username must contain only lowercase letters, numbers, and hyphens";
				}
				return true;
			},
		},
	]);

	return {
		category,
		country,
		region,
		username: username.trim(),
	};
}

/**
 * Prompt user to select a program action
 */
export async function promptProgramAction(
	programName: string,
	matchedPrograms: MatchedProgram[] | null,
): Promise<"update" | "create" | "skip"> {
	console.log(`\n📚 Program: ${programName}`);

	if (matchedPrograms && matchedPrograms.length > 0) {
		console.log("\nMatched Programs:");
		for (let i = 0; i < matchedPrograms.length; i++) {
			const program = matchedPrograms[i];
			if (!program) continue;
			console.log(
				`  ${i + 1}. ${program.name} (${program.id}) - Score: ${program.score.toFixed(2)}`,
			);
			if (program.cycleId) {
				console.log(`     Cycle: ${program.cycleId}`);
			}
		}

		const { action } = await inquirer.prompt<{ action: string }>([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [
					{ name: "Update existing program", value: "update" },
					{ name: "Create new program", value: "create" },
					{ name: "Skip this program", value: "skip" },
				],
			},
		]);

		return action as "update" | "create" | "skip";
	} else {
		console.log("No matching programs found.");

		const { action } = await inquirer.prompt<{ action: string }>([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [
					{ name: "Create new program", value: "create" },
					{ name: "Skip this program", value: "skip" },
				],
			},
		]);

		return action as "create" | "skip";
	}
}

/**
 * Prompt user to select which matched program to update
 */
export async function promptSelectProgram(
	matchedPrograms: MatchedProgram[],
): Promise<MatchedProgram | null> {
	if (matchedPrograms.length === 1) {
		return matchedPrograms[0]!;
	}

	const choices = matchedPrograms.map((program, index) => ({
		name: `${program.name} (${program.id}) - Score: ${program.score.toFixed(2)}${program.cycleId ? ` - Cycle: ${program.cycleId}` : ""}`,
		value: index,
	}));

	const { selectedIndex } = await inquirer.prompt<{ selectedIndex: number }>([
		{
			type: "list",
			name: "selectedIndex",
			message: "Select program to update:",
			choices,
		},
	]);

	return matchedPrograms[selectedIndex] || null;
}

/**
 * Prompt user to confirm changes
 */
export async function promptConfirmChanges(
	message: string,
): Promise<boolean> {
	const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
		{
			type: "confirm",
			name: "confirmed",
			message,
			default: false,
		},
	]);

	return confirmed;
}
