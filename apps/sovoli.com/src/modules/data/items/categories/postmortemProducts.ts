import type { CategoryDefinition } from "~/modules/core/items/types";

export const POSTMORTEM_PRODUCTS_CATEGORY_TREE: CategoryDefinition = {
  id: "postmortem-products",
  name: "Postmortem Products",
  gpcCode: "99000000",
  children: [
    {
      id: "postmortem-products",
      name: "Postmortem Products",
      gpcCode: "99010000",
      parentId: "postmortem-products",
      children: [
      {
        id: "burial-products",
        name: "Burial Products",
        gpcCode: "99010100",
        parentId: "postmortem-products",
        children: [
        {
          id: "coffins-caskets",
          name: "Coffins/Caskets",
          gpcCode: "10008293",
          gpcDescription: "Includes any products that may be described/observed as a container, normally made made from various types of wood or metal, and in some cases with handles or ornaments, used to hold the remains of a dead person or animal to be buried.",
          parentId: "burial-products",
          children: [
          {
            id: "target-use-application",
            name: "Target Use/Application",
            gpcCode: "20001709",
            gpcDescription: "Indicates, with reference to the product branding, labelling or packaging, the descriptive term that is used by the product manufacturer to identify the target use and/or application.",
            parentId: "coffins-caskets",
            children: [
            {
              id: "animal",
              name: "ANIMAL",
              gpcCode: "30005827",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "human-adult",
              name: "HUMAN - ADULT",
              gpcCode: "30019126",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "human-baby-infant",
              name: "HUMAN - BABY/INFANT",
              gpcCode: "30019127",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "unclassified",
              name: "UNCLASSIFIED",
              gpcCode: "30002515",
              gpcDescription: "This term is used to describe those product attributes that are unable to be classified within their specific market; e.g. goat's cheese - goat's cheeses is often generically labelled and cannot be further classified.",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "unidentified",
              name: "UNIDENTIFIED",
              gpcCode: "30002518",
              gpcDescription: "This term is used to describe those product attributes that are unidentifiable given existing or available product information.",
              parentId: "target-use-application",
              children: [],
            },
            ],
          },
          ],
        },
        {
          id: "urns",
          name: "Urns",
          gpcCode: "10008294",
          gpcDescription: "Includes any products that may be described/observed as a container that is often shaped like a vase with a closed top and that is used to hold a person or animal ashes after the cremation process.",
          parentId: "burial-products",
          children: [
          {
            id: "target-use-application",
            name: "Target Use/Application",
            gpcCode: "20001709",
            gpcDescription: "Indicates, with reference to the product branding, labelling or packaging, the descriptive term that is used by the product manufacturer to identify the target use and/or application.",
            parentId: "urns",
            children: [
            {
              id: "animal",
              name: "ANIMAL",
              gpcCode: "30005827",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "human-adult",
              name: "HUMAN - ADULT",
              gpcCode: "30019126",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "human-baby-infant",
              name: "HUMAN - BABY/INFANT",
              gpcCode: "30019127",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "unclassified",
              name: "UNCLASSIFIED",
              gpcCode: "30002515",
              gpcDescription: "This term is used to describe those product attributes that are unable to be classified within their specific market; e.g. goat's cheese - goat's cheeses is often generically labelled and cannot be further classified.",
              parentId: "target-use-application",
              children: [],
            },
            {
              id: "unidentified",
              name: "UNIDENTIFIED",
              gpcCode: "30002518",
              gpcDescription: "This term is used to describe those product attributes that are unidentifiable given existing or available product information.",
              parentId: "target-use-application",
              children: [],
            },
            ],
          },
          ],
        },
        ],
      },
      {
        id: "cemetery-products",
        name: "Cemetery Products",
        gpcCode: "99010200",
        parentId: "postmortem-products",
        children: [
        {
          id: "grave-markers",
          name: "Grave Markers",
          gpcCode: "10008383",
          gpcDescription: "Includes any products that may be described/observed as a products or accessories that are specifically designed to be used to decorate grave to commemorate deceased person. Includes products such as crosses, memorial stones, tombstones, and gravestones. ",
          parentId: "cemetery-products",
          children: [],
        },
        ],
      },
      ],
    },
  ],
};
