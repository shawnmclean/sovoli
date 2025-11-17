import type { CategoryDefinition } from "~/modules/core/items/types";

export const MONETARY_ASSETS_CATEGORY_TREE: CategoryDefinition = {
  id: "monetary-assets",
  name: "Monetary Assets",
  gpcCode: "96000000",
  children: [
    {
      id: "currency-postage-certificates",
      name: "Currency/Postage/Certificates",
      gpcCode: "96010000",
      parentId: "monetary-assets",
      children: [
      {
        id: "currency-certificates",
        name: "Currency/Certificates",
        gpcCode: "96010100",
        gpcDescription: "Includes products that represent a medium of exchange, measure of wealth, or means of payment.",
        parentId: "currency-postage-certificates",
        children: [
        {
          id: "bank-notes-cheques",
          name: "Bank Notes/Cheques",
          gpcCode: "10007970",
          gpcDescription: "Includes any products that can be described as a type of negotiable promissory note, made by a legal entity, payable to the bearer on demand.",
          parentId: "currency-certificates",
          children: [
          {
            id: "country-zone-of-origin",
            name: "Country/Zone of Origin",
            gpcCode: "20000743",
            gpcDescription: "Indicates, with reference to the product branding, labelling or packaging, the descriptive term that is used by the manufacturer fruits/vegetables to identify the specific country in which the product has grown.",
            parentId: "bank-notes-cheques",
            children: [
            {
              id: "european-union",
              name: "EUROPEAN UNION",
              gpcCode: "30015349",
              parentId: "country-zone-of-origin",
              children: [],
            },
            {
              id: "unclassified",
              name: "UNCLASSIFIED",
              gpcCode: "30002515",
              gpcDescription: "This term is used to describe those product attributes that are unable to be classified within their specific market; e.g. goat's cheese - goat's cheeses is often generically labelled and cannot be further classified.",
              parentId: "country-zone-of-origin",
              children: [],
            },
            {
              id: "unidentified",
              name: "UNIDENTIFIED",
              gpcCode: "30002518",
              gpcDescription: "This term is used to describe those product attributes that are unidentifiable given existing or available product information.",
              parentId: "country-zone-of-origin",
              children: [],
            },
            ],
          },
          ],
        },
        {
          id: "bills",
          name: "Bills",
          gpcCode: "10007969",
          gpcDescription: "Includes any products that can be described as a type of negotiable promissory note, made by a legal entity, payable to the bearer on demand.",
          parentId: "currency-certificates",
          children: [
          {
            id: "country-zone-of-origin",
            name: "Country/Zone of Origin",
            gpcCode: "20000743",
            gpcDescription: "Indicates, with reference to the product branding, labelling or packaging, the descriptive term that is used by the manufacturer fruits/vegetables to identify the specific country in which the product has grown.",
            parentId: "bills",
            children: [
            {
              id: "european-union",
              name: "EUROPEAN UNION",
              gpcCode: "30015349",
              parentId: "country-zone-of-origin",
              children: [],
            },
            {
              id: "unclassified",
              name: "UNCLASSIFIED",
              gpcCode: "30002515",
              gpcDescription: "This term is used to describe those product attributes that are unable to be classified within their specific market; e.g. goat's cheese - goat's cheeses is often generically labelled and cannot be further classified.",
              parentId: "country-zone-of-origin",
              children: [],
            },
            {
              id: "unidentified",
              name: "UNIDENTIFIED",
              gpcCode: "30002518",
              gpcDescription: "This term is used to describe those product attributes that are unidentifiable given existing or available product information.",
              parentId: "country-zone-of-origin",
              children: [],
            },
            ],
          },
          ],
        },
        {
          id: "coins",
          name: "Coins",
          gpcCode: "10007971",
          gpcDescription: "Includes any products that can be described as a type of negotiable unit, made by a legal entity, payable to the bearer on demand.",
          parentId: "currency-certificates",
          children: [
          {
            id: "country-zone-of-origin",
            name: "Country/Zone of Origin",
            gpcCode: "20000743",
            gpcDescription: "Indicates, with reference to the product branding, labelling or packaging, the descriptive term that is used by the manufacturer fruits/vegetables to identify the specific country in which the product has grown.",
            parentId: "coins",
            children: [
            {
              id: "european-union",
              name: "EUROPEAN UNION",
              gpcCode: "30015349",
              parentId: "country-zone-of-origin",
              children: [],
            },
            {
              id: "unclassified",
              name: "UNCLASSIFIED",
              gpcCode: "30002515",
              gpcDescription: "This term is used to describe those product attributes that are unable to be classified within their specific market; e.g. goat's cheese - goat's cheeses is often generically labelled and cannot be further classified.",
              parentId: "country-zone-of-origin",
              children: [],
            },
            {
              id: "unidentified",
              name: "UNIDENTIFIED",
              gpcCode: "30002518",
              gpcDescription: "This term is used to describe those product attributes that are unidentifiable given existing or available product information.",
              parentId: "country-zone-of-origin",
              children: [],
            },
            ],
          },
          ],
        },
        {
          id: "digital-currency",
          name: "Digital Currency",
          gpcCode: "10007972",
          gpcDescription: "Includes any products that can be described as a type of negotiable virtual unit, such as cryptocurrency, virtual currency.",
          parentId: "currency-certificates",
          children: [],
        },
        ],
      },
      {
        id: "prepaid-cards-gift-cards-vouchers",
        name: "PrePaid Cards/Gift Cards/Vouchers",
        gpcCode: "96010200",
        gpcDescription: "Includes any products which may be observed as being a prepaid credit for use towards items or services; or future purchases. ",
        parentId: "currency-postage-certificates",
        children: [
        {
          id: "prepaid-cards-gift-cards-vouchers",
          name: "PrePaid Cards/Gift Cards/Vouchers",
          gpcCode: "10008028",
          gpcDescription: "Includes any products which may be observed as being a prepaid credit for use towards items or services; or future purchases. This includes store specific gift cards; prepaid credit cards; vouchers for services; prepaid mobile communication. These may be represented as either a physical or digital object. ",
          parentId: "prepaid-cards-gift-cards-vouchers",
          children: [],
        },
        ],
      },
      ],
    },
  ],
};
