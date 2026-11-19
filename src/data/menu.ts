/**
 * ─────────────────────────────────────────────────────────────
 *  KINGBOMB MENU — edit this one file to fill in your menu.
 * ─────────────────────────────────────────────────────────────
 *
 *  Each item needs:
 *    id          unique, lowercase-with-dashes (never reuse an old id)
 *    name        what customers see
 *    description one or two short sentences
 *    price       in DOLLARS, e.g. 14.5 for $14.50
 *    category    one of CATEGORIES below
 *    image       a file in /public/menu/, e.g. "/menu/king-platter.jpg"
 *                (use "" for no photo; 1200×900 JPG/WebP works great)
 *    available   false hides it from the menu and blocks ordering it
 *
 *  While this list has no available items, the Menu page shows
 *  "COMING SOON". As soon as it has items, the page lists them.
 *
 *  To turn on online ordering, ALSO set ORDERING_ENABLED = true.
 */

export const ORDERING_ENABLED = true;

/** Optional flat delivery fee in dollars (0 = free). */
export const DELIVERY_FEE = 0;

export const CATEGORIES = [
  "Coastal Party Platters",
  "Tacos",
  "Pho",
  "Sides",
  "Drinks",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
};

export const MENU: MenuItem[] = [
  // TEST ITEM: test-ordering branch only, never merge into main.
  {
    id: "test-king-platter",
    name: "Test King Platter",
    description: "Test item for checking Stripe checkout and order emails.",
    price: 5,
    category: "Coastal Party Platters",
    image: "",
    available: true,
  },
  // Example — copy, uncomment, and edit:
  // {
  //   id: "king-platter",
  //   name: "The King Platter",
  //   description: "Snow crab, jumbo shrimp, mussels, corn and potatoes in our house butter.",
  //   price: 89,
  //   category: "Coastal Party Platters",
  //   image: "/menu/king-platter.jpg",
  //   available: true,
  // },
];

// ── Helpers used by the site (no need to edit below) ─────────

export const availableItems = () => MENU.filter((i) => i.available);

export const hasMenu = () => availableItems().length > 0;

export const orderingOn = () => ORDERING_ENABLED && hasMenu();

export const findItem = (id: string) =>
  MENU.find((i) => i.id === id && i.available);

export const toCents = (dollars: number) => Math.round(dollars * 100);

export const formatPrice = (dollars: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(dollars);
