import type { CategoryDefinition } from "~/modules/core/items/types";

export const SERVICES_VENDING_MACHINES_CATEGORY_TREE: CategoryDefinition = {
  id: "services-vending-machines",
  name: "Services/Vending Machines",
  gpcCode: "95000000",
  children: [
    {
      id: "building-construction-and-related-services",
      name: "Building Construction & Related Services",
      gpcCode: "95020000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "building-construction-and-related-services",
        name: "Building Construction & Related Services",
        gpcCode: "95020100",
        parentId: "building-construction-and-related-services",
        children: [
        {
          id: "building-construction-and-related-services",
          name: "Building Construction & Related Services",
          gpcCode: "10007584",
          gpcDescription: "Includes any services that may be described/observed as services rendered by contractors or subcontractors in the construction or making of permanent buildings. Includes services rendered by persons or organisations engaged in the restoration of objects to their original condition.",
          parentId: "building-construction-and-related-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "business-and-commercial-services",
      name: "Business and Commercial Services",
      gpcCode: "95010000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "accounting-services",
        name: "Accounting Services",
        gpcCode: "95010100",
        parentId: "business-and-commercial-services",
        children: [
        {
          id: "accounting-services",
          name: "Accounting Services",
          gpcCode: "10007578",
          gpcDescription: "Includes any services that may be described/observed as accounting services resulting from legal requirements and taxation services.",
          parentId: "accounting-services",
          children: [],
        },
        ],
      },
      {
        id: "advertising-services",
        name: "Advertising Services",
        gpcCode: "95010200",
        parentId: "business-and-commercial-services",
        children: [
        {
          id: "advertising-services",
          name: "Advertising Services",
          gpcCode: "10007579",
          gpcDescription: "Includes any services that may be described/observed as sale or leasing of advertising space or time; planning, creating and placement services of advertising; and other advertising materials. ",
          parentId: "advertising-services",
          children: [],
        },
        ],
      },
      {
        id: "architectural-and-engineering-services",
        name: "Architectural and Engineering Services",
        gpcCode: "95010300",
        parentId: "business-and-commercial-services",
        children: [
        {
          id: "architectural-and-engineering-services",
          name: "Architectural and Engineering Services",
          gpcCode: "10007580",
          gpcDescription: "Includes any services that may be described/observed as services by engineering firms to provide blueprints and designs for buildings and other structures. Includes planning, design, construction and management services for building structures, installations, civil engineering work and industrial processes. ",
          parentId: "architectural-and-engineering-services",
          children: [],
        },
        ],
      },
      {
        id: "business-management-and-consulting-services",
        name: "Business Management & Consulting Services",
        gpcCode: "95010400",
        parentId: "business-and-commercial-services",
        children: [
        {
          id: "business-management-and-consulting-services",
          name: "Business Management & Consulting Services",
          gpcCode: "10007581",
          gpcDescription: "Includes any services that may be described/observed as services that include the overseeing and supervising of business operations. Includes planning, organizing, staffing, and leading.",
          parentId: "business-management-and-consulting-services",
          children: [],
        },
        ],
      },
      {
        id: "computer-and-technology-services",
        name: "Computer and Technology Services",
        gpcCode: "95010500",
        parentId: "business-and-commercial-services",
        children: [
        {
          id: "computer-and-technology-services",
          name: "Computer and Technology Services",
          gpcCode: "10007582",
          gpcDescription: "Includes any services that may be described/observed as services related to the installation of computer hardware, software. Includes data processing and database services.",
          parentId: "computer-and-technology-services",
          children: [],
        },
        ],
      },
      {
        id: "legal-services",
        name: "Legal Services",
        gpcCode: "95010600",
        parentId: "business-and-commercial-services",
        children: [
        {
          id: "legal-services",
          name: "Legal Services",
          gpcCode: "10007583",
          gpcDescription: "Includes any services that may be described/observed as services related to attorneys, notaries, arbitrators, and mediators.",
          parentId: "legal-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "cleaning-services",
      name: "Cleaning Services",
      gpcCode: "95030000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "cleaning-services",
        name: "Cleaning Services",
        gpcCode: "95030100",
        parentId: "cleaning-services",
        children: [
        {
          id: "cleaning-services",
          name: "Cleaning Services",
          gpcCode: "10007585",
          gpcDescription: "Includes any services that may be described/observed as services provided to cleaning for individuals, businesses, associations, and residential premises.",
          parentId: "cleaning-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "communication-services",
      name: "Communication Services",
      gpcCode: "95040000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "audio-visual-services",
        name: "Audio-Visual Services",
        gpcCode: "95040100",
        parentId: "communication-services",
        children: [
        {
          id: "audio-visual-services",
          name: "Audio-Visual Services",
          gpcCode: "10007586",
          gpcDescription: "Includes any services that may be described/observed as services related to motion picture and video production and distribution services, motion picture projection services, radio and television services, radio and television transmission services, and sound recording.",
          parentId: "audio-visual-services",
          children: [],
        },
        ],
      },
      {
        id: "telecommunications-services",
        name: "Telecommunications Services",
        gpcCode: "95040200",
        parentId: "communication-services",
        children: [
        {
          id: "telecommunications-services",
          name: "Telecommunications Services",
          gpcCode: "10007587",
          gpcDescription: "Includes any services that may be described/observed as services provided by a telecommunications provider, or a specified set of user-information transfer capabilities provided to a group of users by a telecommunications system.",
          parentId: "telecommunications-services",
          children: [],
        },
        {
          id: "warranty-services",
          name: "Warranty Services",
          gpcCode: "10008408",
          gpcDescription: "Includes any services that may be described/observed as services related with communications warranty services provided by companies or service providers in the telecommunications industry. These warranties are designed to assure customers that the products or services they purchase, such as smartphones, or communication software, will perform as promised and meet certain quality standards.",
          parentId: "telecommunications-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "dispensing-vending-machines",
      name: "Dispensing/Vending Machines",
      gpcCode: "95160000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "dispensing-vending-machines",
        name: "Dispensing/Vending Machines",
        gpcCode: "95160100",
        parentId: "dispensing-vending-machines",
        children: [
        {
          id: "coin-operated-control-unit",
          name: "Coin Operated Control Unit",
          gpcCode: "10008110",
          gpcDescription: "Includes any products that can be described/observed as a coin operated add-on unit which allows a machine to act as a vending machine.",
          parentId: "dispensing-vending-machines",
          children: [],
        },
        {
          id: "vending-machine",
          name: "Vending Machine",
          gpcCode: "10008109",
          gpcDescription: "Includes any products that can be described/observed as a machine that dispenses small articles such as food, drinks, or other items when a payment is made (i.e. coin, bill, credit card, prepaid card/token or digital payment method).",
          parentId: "dispensing-vending-machines",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "educational-and-entertainment-services",
      name: "Educational & Entertainment Services",
      gpcCode: "95050000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "educational-services",
        name: "Educational Services",
        gpcCode: "95050100",
        parentId: "educational-and-entertainment-services",
        children: [
        {
          id: "educational-services",
          name: "Educational Services",
          gpcCode: "10007588",
          gpcDescription: "Includes any services that may be described/observed as services related to primary, secondary, post-secondary and adult education. ",
          parentId: "educational-services",
          children: [],
        },
        ],
      },
      {
        id: "entertainment-services",
        name: "Entertainment Services",
        gpcCode: "95050200",
        parentId: "educational-and-entertainment-services",
        children: [
        {
          id: "entertainment-services",
          name: "Entertainment Services",
          gpcCode: "10007589",
          gpcDescription: "Includes any services that may be described/observed as services related to entertainment, amusement or recreation.",
          parentId: "entertainment-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "energy-and-environmental-services",
      name: "Energy and Environmental Services",
      gpcCode: "95060000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "energy-services",
        name: "Energy Services",
        gpcCode: "95060100",
        parentId: "energy-and-environmental-services",
        children: [
        {
          id: "energy-services",
          name: "Energy Services",
          gpcCode: "10007590",
          gpcDescription: "Includes any services that may be described/observed as services related to energy mining, energy distribution, and pipeline transportation of fuels.",
          parentId: "energy-services",
          children: [],
        },
        ],
      },
      {
        id: "environmental-services",
        name: "Environmental Services",
        gpcCode: "95060200",
        parentId: "energy-and-environmental-services",
        children: [
        {
          id: "environmental-services",
          name: "Environmental Services",
          gpcCode: "10007591",
          gpcDescription: "Includes any services that may be described/observed as services related to sewage, refuse disposal, sanitation, vehicle emissions, noise abatement, and nature/landscape protection",
          parentId: "environmental-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "financial-services",
      name: "Financial Services",
      gpcCode: "95070000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "financial-services",
        name: "Financial Services",
        gpcCode: "95070100",
        parentId: "financial-services",
        children: [
        {
          id: "financial-services",
          name: "Financial Services",
          gpcCode: "10007592",
          gpcDescription: "Includes any services that may be described/observed as services related to the finance industry including businesses that manage money, credit unions, banks, credit-card companies, insurance companies, real estate companies, accountancy companies, consumer-finance companies, stock brokerages, investment funds, individual managers and some government-sponsored enterprises.",
          parentId: "financial-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "food-drink-and-accommodation-services",
      name: "Food/Drink and Accommodation Services",
      gpcCode: "95110000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "food-and-drink-services",
        name: "Food and Drink Services",
        gpcCode: "95110300",
        parentId: "food-drink-and-accommodation-services",
        children: [
        {
          id: "food-and-drink-services",
          name: "Food and Drink Services",
          gpcCode: "10007596",
          gpcDescription: "Includes any services that may be described/observed as services provided by persons or establishments whose aim is to prepare food and drink for consumption. services provided by persons or establishments whose aim is to prepare food and drink for consumption",
          parentId: "food-and-drink-services",
          children: [],
        },
        ],
      },
      {
        id: "temporary-accommodation-services",
        name: "Temporary Accommodation Services",
        gpcCode: "95110400",
        parentId: "food-drink-and-accommodation-services",
        children: [
        {
          id: "temporary-accommodation-services",
          name: "Temporary Accommodation Services",
          gpcCode: "10007597",
          gpcDescription: "Includes any services that may be described/observed as services provided to obtain bed and board in hotels, boarding houses or other establishments providing temporary accommodation.",
          parentId: "temporary-accommodation-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "maintenance-repair-and-installation-services",
      name: "Maintenance/Repair and Installation Services",
      gpcCode: "95120000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "installation-services",
        name: "Installation Services",
        gpcCode: "95120200",
        parentId: "maintenance-repair-and-installation-services",
        children: [
        {
          id: "installation-services",
          name: "Installation Services",
          gpcCode: "10007599",
          gpcDescription: "Includes any services that may be described/observed as services related to the installation of necessary devices, equipment, machinery, building infrastructure, and supporting utilities in industrial, business, governmental, and residential institutions. ",
          parentId: "installation-services",
          children: [],
        },
        ],
      },
      {
        id: "maintenance-repair-services",
        name: "Maintenance/Repair Services",
        gpcCode: "95120100",
        parentId: "maintenance-repair-and-installation-services",
        children: [
        {
          id: "maintenance-repair-services",
          name: "Maintenance/Repair Services",
          gpcCode: "10007598",
          gpcDescription: "Includes any services that may be described/observed as services related to the repairing or replacing of necessary devices, equipment, machinery, building infrastructure, and supporting utilities in industrial, business, governmental, and residential institutions.",
          parentId: "maintenance-repair-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "medical-and-beauty-care-services",
      name: "Medical and Beauty Care Services",
      gpcCode: "95130000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "hygienic-and-beauty-care-services",
        name: "Hygienic and Beauty Care Services",
        gpcCode: "95130100",
        parentId: "medical-and-beauty-care-services",
        children: [
        {
          id: "hygienic-and-beauty-care-services",
          name: "Hygienic and Beauty Care Services",
          gpcCode: "10007600",
          gpcDescription: "Includes any services that may be described/observed as services related to hygienic and beauty care. services related to hygienic and beauty care.",
          parentId: "hygienic-and-beauty-care-services",
          children: [],
        },
        ],
      },
      {
        id: "medical-services",
        name: "Medical Services",
        gpcCode: "95130200",
        parentId: "medical-and-beauty-care-services",
        children: [
        {
          id: "medical-services",
          name: "Medical Services",
          gpcCode: "10007601",
          gpcDescription: "Includes any services that may be described/observed as services related to medical care given by persons or establishments to human beings.",
          parentId: "medical-services",
          children: [],
        },
        ],
      },
      {
        id: "veterinary-services",
        name: "Veterinary Services",
        gpcCode: "95130300",
        parentId: "medical-and-beauty-care-services",
        children: [
        {
          id: "veterinary-services",
          name: "Veterinary Services",
          gpcCode: "10007602",
          gpcDescription: "Includes any services that may be described/observed as services related to medical care given by persons or establishments to animals.",
          parentId: "veterinary-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "packaging-storage-services",
      name: "Packaging/Storage Services",
      gpcCode: "95080000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "packaging-storage-services",
        name: "Packaging/Storage Services",
        gpcCode: "95080100",
        parentId: "packaging-storage-services",
        children: [
        {
          id: "packaging-storage-services",
          name: "Packaging/Storage Services",
          gpcCode: "10007593",
          gpcDescription: "Includes any services that may be described/observed as services to prepare goods for transport, warehousing, logistics, sale, and end use. ",
          parentId: "packaging-storage-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "postal-services",
      name: "Postal Services",
      gpcCode: "95090000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "postal-services",
        name: "Postal Services",
        gpcCode: "95090100",
        parentId: "postal-services",
        children: [
        {
          id: "postal-services",
          name: "Postal Services",
          gpcCode: "10007594",
          gpcDescription: "Includes any services that may be described/observed as postal and courier services including express delivery.",
          parentId: "postal-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "scientific-and-technological-services",
      name: "Scientific and Technological Services",
      gpcCode: "95100000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "scientific-and-technological-services",
        name: "Scientific and Technological Services",
        gpcCode: "95100100",
        parentId: "scientific-and-technological-services",
        children: [
        {
          id: "scientific-and-technological-services",
          name: "Scientific and Technological Services",
          gpcCode: "10007595",
          gpcDescription: "Includes any services that may be described/observed as services related to scientific and technological research and design. Includes industrial analysis and research services; design and development of computer hardware and software.",
          parentId: "scientific-and-technological-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "transportation-services",
      name: "Transportation Services",
      gpcCode: "95140000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "transportation-services",
        name: "Transportation Services",
        gpcCode: "95140100",
        parentId: "transportation-services",
        children: [
        {
          id: "transportation-services",
          name: "Transportation Services",
          gpcCode: "10007603",
          gpcDescription: "Includes any services that may be described/observed as services related to the movement of physical items from one location to another. ",
          parentId: "transportation-services",
          children: [],
        },
        ],
      },
      ],
    },
    {
      id: "travel-services",
      name: "Travel Services",
      gpcCode: "95150000",
      parentId: "services-vending-machines",
      children: [
      {
        id: "travel-services",
        name: "Travel Services",
        gpcCode: "95150100",
        parentId: "travel-services",
        children: [
        {
          id: "travel-services",
          name: "Travel Services",
          gpcCode: "10007605",
          gpcDescription: "Includes any services that may be described/observed as services that include the overseeing and supervising of  business and personal travel. Includes planning and  organizing. ",
          parentId: "travel-services",
          children: [],
        },
        ],
      },
      ],
    },
  ],
};
