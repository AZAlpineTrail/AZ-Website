export const BONFIRE_STORE_URL = "https://www.bonfire.com/store/arizona-alpine-trail/";

const campaign = "https://www.bonfire.com/arizona-alpine-trail-performance-tee/";

const colors = {
  red: { name: "True Red", hex: "#ad253a" },
  green: { name: "Forest Green", hex: "#304c3d" },
  navy: { name: "True Navy", hex: "#202538" },
  white: { name: "White", hex: "#ffffff" },
};

export const products = [
  {
    id: "long-sleeve",
    name: "Unisex Performance Long Sleeve Tee",
    shown: "True Red",
    price: "$34.99",
    colors: [colors.red, colors.navy, colors.green, colors.white],
    href: `${campaign}?productType=9898343c-f26f-4d94-8b2c-af29f931bc3c`,
  },
  {
    id: "short-sleeve",
    name: "Classic Performance Tee",
    shown: "Forest Green",
    price: "$34.99",
    colors: [colors.green, colors.navy, colors.white],
    href: `${campaign}?productType=3ecf8cc0-4c80-4648-9f4b-3733badbe960`,
  },
  {
    id: "hoodie",
    name: "UV Performance Long Sleeve Hoodie",
    shown: "True Navy",
    price: "$34.99",
    colors: [colors.navy, colors.white],
    href: `${campaign}?productType=4bed906c-5e31-49ef-9941-4fe3cdb910c0`,
  },
];
