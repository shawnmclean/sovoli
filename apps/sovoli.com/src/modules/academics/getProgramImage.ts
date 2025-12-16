import type { Program } from "./types";
import type { Media } from "../core/media/types";

/**
 * Gets the first image from a program's media, skipping videos.
 * Checks cover image first (if it's an image), then finds the first image in gallery.
 *
 * @param program - The program to get the image from
 * @returns The first image Media object, or undefined if no image is found
 */
export function getProgramImage(program: Program): Media | undefined {
	// Check cover image first (if it's an image)
	if (program.media?.cover?.type === "image") {
		return program.media.cover;
	}

	// Find first image in gallery (skip videos)
	const firstImage = program.media?.gallery?.find(
		(media) => media.type === "image",
	);
	if (firstImage) {
		return firstImage;
	}

	return undefined;
}

/**
 * Gets the URL of the first image from a program's media, skipping videos.
 * Falls back to cover image URL, then first gallery image URL, then standard program image.
 *
 * @param program - The program to get the image URL from
 * @returns The image URL string, or undefined if no image is found
 */
export function getProgramImageUrl(program: Program): string | undefined {
	const image = getProgramImage(program);
	if (image?.url) {
		return image.url;
	}

	// Fallback to standard program image
	return program.standardProgramVersion?.program.image;
}

