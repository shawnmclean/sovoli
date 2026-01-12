/**
 * JSON Schema for lead extraction validation
 * Used with ajv for runtime validation
 */

export const leadExtractionSchema = {
  type: "object",
  required: ["artifact", "extraction", "entityCandidates"],
  properties: {
    artifact: {
      type: "object",
      required: ["id", "source", "file"],
      properties: {
        id: { type: "string" },
        source: {
          type: "object",
          required: [
            "ingest_method",
            "platform_hint",
            "captured_at",
            "locale_hint",
          ],
          properties: {
            ingest_method: {
              type: "string",
              enum: ["manual_upload", "file_read", "api_ingest"],
            },
            platform_hint: { oneOf: [{ type: "string" }, { type: "null" }] },
            captured_at: {
              oneOf: [{ type: "string" }, { type: "null" }],
            },
            locale_hint: { oneOf: [{ type: "string" }, { type: "null" }] },
          },
        },
        file: {
          type: "object",
          required: ["filename", "hash"],
          properties: {
            filename: { oneOf: [{ type: "string" }, { type: "null" }] },
            hash: { oneOf: [{ type: "string" }, { type: "null" }] },
          },
        },
      },
    },
    extraction: {
      type: "object",
      required: ["organizationNames", "programs", "contacts", "socialLinks"],
      properties: {
        organizationNames: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              confidence: {
                type: "string",
                enum: ["high", "medium", "low"],
                nullable: true,
              },
            },
          },
        },
        programs: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              quickFacts: {
                type: "array",
                items: { type: "string" },
                nullable: true,
              },
              whatYouWillLearn: {
                type: "array",
                items: { type: "string" },
                nullable: true,
              },
              pricing: {
                type: "object",
                nullable: true,
                properties: {
                  registration: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["amount"],
                      properties: {
                        amount: { type: "string" },
                        currency: { type: "string", nullable: true },
                        label: { type: "string", nullable: true },
                        notes: { type: "string", nullable: true },
                      },
                    },
                    nullable: true,
                  },
                  tuition: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["amount"],
                      properties: {
                        amount: { type: "string" },
                        currency: { type: "string", nullable: true },
                        label: { type: "string", nullable: true },
                        billingCycle: { type: "string", nullable: true },
                        notes: { type: "string", nullable: true },
                      },
                    },
                    nullable: true,
                  },
                  materials: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["amount"],
                      properties: {
                        amount: { type: "string" },
                        currency: { type: "string", nullable: true },
                        label: { type: "string", nullable: true },
                        notes: { type: "string", nullable: true },
                      },
                    },
                    nullable: true,
                  },
                  paymentPlans: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                  },
                  other: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                  },
                },
              },
              schedule: {
                type: "object",
                nullable: true,
                properties: {
                  days: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                  },
                  times: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                  },
                  dates: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                  },
                  duration: { type: "string", nullable: true },
                },
              },
              location: { oneOf: [{ type: "string" }, { type: "null" }] },
              callsToAction: {
                type: "array",
                items: { type: "string" },
                nullable: true,
              },
            },
          },
        },
        contacts: {
          type: "object",
          required: [],
          properties: {
            phones: {
              type: "array",
              items: {
                type: "object",
                required: ["value"],
                properties: {
                  value: { type: "string" },
                  type: {
                    type: "string",
                    enum: ["phone", "whatsapp"],
                    nullable: true,
                  },
                },
              },
              nullable: true,
            },
            emails: {
              type: "array",
              items: {
                type: "object",
                required: ["value"],
                properties: {
                  value: { type: "string" },
                },
              },
              nullable: true,
            },
          },
        },
        socialLinks: {
          type: "array",
          items: {
            type: "object",
            required: ["platform", "value"],
            properties: {
              platform: {
                type: "string",
                // Allow any string to handle unknown platforms gracefully
                // Common values: "facebook", "instagram", "youtube", "x", "website", "other"
              },
              handle: { type: "string", nullable: true },
              url: { type: "string", nullable: true },
              value: { type: "string" },
            },
          },
        },
        urls: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
        locations: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
        platformSignals: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
      },
    },
    entityCandidates: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "type", "ref"],
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: [
              "organization",
              "program",
              "phone",
              "email",
              "social_link",
              "website",
            ],
          },
          ref: { type: "string" },
          value: { oneOf: [{ type: "string" }, { type: "null" }] },
        },
      },
    },
  },
} as const;
