import type { Program } from "~/modules/academics/types";
import {
	HEALING_EMERALD_MASSAGE_PROGRAM_GROUP,
	healingEmeraldProgramQuickFacts,
	massageProgramHighlights,
} from "./shared";
import { HEALING_EMERALD_MASSAGE_THERAPY_CYCLE_1 } from "../cycles";

export const HEALING_EMERALD_MASSAGE_THERAPY_PROGRAM: Program = {
	id: "hew-massage-therapy",
	name: "Massage Therapy",
	slug: "massage-therapy",
	audience: "student",
	quickFacts: healingEmeraldProgramQuickFacts,
	highlights: massageProgramHighlights,
	tagline: "Master the art of therapeutic massage",
	outcome:
		"Become a certified massage therapist ready for professional practice",
	description:
		"Our comprehensive Massage Therapy program teaches students the fundamental and advanced techniques of therapeutic massage. Students will learn Swedish massage, deep tissue massage, and other modalities in a professional spa environment. This program prepares graduates for careers in spas, wellness centres, hotels, and private practice.",
	whatYouWillLearn: [
		{
			heading: "Massage Fundamentals",
			items: [
				{
					id: "anatomy-basics",
					title: "Human Anatomy & Physiology",
					blurb:
						"Understand the musculoskeletal system and how massage affects the body.",
					tag: "Foundations",
				},
				{
					id: "massage-theory",
					title: "Massage Theory & History",
					blurb:
						"Learn the origins and scientific principles behind therapeutic massage.",
				},
			],
		},
		{
			heading: "Massage Techniques",
			items: [
				{
					id: "swedish-massage",
					title: "Swedish Massage",
					blurb:
						"Master the classic relaxation massage technique with flowing strokes.",
					tag: "Core Skill",
				},
				{
					id: "deep-tissue",
					title: "Deep Tissue Massage",
					blurb:
						"Learn to work on deeper muscle layers to release chronic tension.",
				},
				{
					id: "pressure-points",
					title: "Pressure Point Therapy",
					blurb:
						"Identify and work trigger points to relieve pain and tension.",
				},
			],
		},
		{
			heading: "Professional Practice",
			items: [
				{
					id: "client-consultation",
					title: "Client Consultation & Assessment",
					blurb:
						"Learn to assess client needs and create personalized treatment plans.",
					tag: "Hands-on",
				},
				{
					id: "hygiene-safety",
					title: "Hygiene & Safety Standards",
					blurb:
						"Maintain professional standards for cleanliness and client safety.",
				},
				{
					id: "business-skills",
					title: "Business & Client Management",
					blurb:
						"Build skills for running your own massage practice or working in a spa.",
					tag: "Career Ready",
				},
			],
		},
	],
	group: { ...HEALING_EMERALD_MASSAGE_PROGRAM_GROUP, order: 1 },
	cycles: [HEALING_EMERALD_MASSAGE_THERAPY_CYCLE_1],
	media: [],
};
