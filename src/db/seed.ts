import dotenv from "dotenv";
import { db } from "./index";
import { categories, menuItems, extras, orders, orderItems } from "./schema";

dotenv.config({ path: ".env.local" });

async function main() {
  // wipe (prototype reseed)
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(menuItems);
  await db.delete(extras);
  await db.delete(categories);

  const catDefs = [
    {
      slug: "private-school-kota",
      name: "Private School Kota",
      tagline: "Loaded half-loaf kotas with special garlic — from R40",
      image: "/images/kota-private.jpg",
    },
    {
      slug: "street-kotas",
      name: "Street Kotas",
      tagline: "The originals, baked fresh daily — from R20",
      image: "/images/kota-street.jpg",
    },
    {
      slug: "worsroll",
      name: "Worsroll",
      tagline: "Flame-grilled boerewors rolls — from R25",
      image: "/images/worsroll.jpg",
    },
    {
      slug: "hamburgers",
      name: "Hamburgers",
      tagline: "Two-slice township hamburgers — from R15",
      image: "/images/hamburger.jpg",
    },
    {
      slug: "wrap-kota",
      name: "Wrap Kota",
      tagline: "Kota fillings rolled & toasted — from R40",
      image: "/images/wrap-kota.jpg",
    },
    {
      slug: "shawarma",
      name: "Shawarma",
      tagline: "Chicken, wors & Russian — R60 each",
      image: "/images/shawarma.jpg",
    },
    {
      slug: "burgers-wings",
      name: "Burgers & Wings",
      tagline: "Double cheeseburgers, wings & loaded fries",
      image: "/images/burgers-wings.jpg",
    },
    {
      slug: "box-meals",
      name: "Box Meals & Combos",
      tagline: "Share boxes & combo deals — from R40",
      image: "/images/box-meals.jpg",
    },
    {
      slug: "breakfast",
      name: "Breakfast Run",
      tagline: "Morning plates to start the hustle — from R30",
      image: "/images/breakfast.jpg",
    },
    {
      slug: "hearty-meals",
      name: "Hearty Meals",
      tagline: "Flame-grilled & fully loaded — from R40",
      image: "/images/hearty.jpg",
    },
  ];

  const itemDefs: Record<string, Array<[string, string, number, boolean]>> = {
    "private-school-kota": [
      ["Rankuwa via Lentiswe", "Archaar, lettuce, tomato, polony, chips, cheese, vienna & special garlic.", 4000, false],
      ["Pitori Mahlanyeng", "Archaar, lettuce, tomato, polony, chips, cheese, vienna, egg & special garlic.", 4500, false],
      ["Pheli via Church", "Archaar, lettuce, tomato, polony, chips, cheese, russian & special garlic.", 5000, true],
      ["Tshwane ra Tshwana", "Archaar, lettuce, tomato, polony, chips, cheese, russian, egg & special garlic.", 5500, false],
      ["Mams via Jackbhuda", "Archaar, lettuce, tomato, polony, chips, cheese, egg, vienna, russian & special garlic.", 6000, true],
      ["Sosha via Jukulyne", "Archaar, lettuce, tomato, polony, chips, cheese, vienna, russian, patty & special garlic.", 7000, false],
      ["Hamitown via Themba", "Archaar, lettuce, tomato, polony, chips, cheese, rib burger & special garlic.", 7000, false],
      ["Mabopane via T80", "Archaar, lettuce, tomato, polony, chips, cheese, egg, patty, wors, vienna & special garlic.", 8000, false],
      ["Thembsa Monneng", "The whole timetable: archaar, lettuce, tomato, polony, chips, cheese, egg, patty, russian, wors, vienna & special garlic.", 10000, true],
    ],
    "street-kotas": [
      ["Chip Kota", "Quarter loaf baked fresh, loaded with hot chips & archaar.", 2000, false],
      ["Cheese Kota", "Hot chips, archaar & a thick slab of melted cheese.", 2500, true],
      ["Polony Kota", "Chips, cheese, sliced polony & archaar.", 3000, false],
      ["Full House Kota", "Chips, cheese, polony, vienna & russian — the street classic.", 3500, false],
    ],
    worsroll: [
      ["Worsroll", "Flame-grilled boerewors in a fresh buttered roll.", 2500, true],
      ["Worsroll & Chips", "The wors roll you love with a side of hot chips.", 4000, false],
      ["Worsroll, Chips & 2 Buffalo Wings", "The full pull: roll, chips and two sticky buffalo wings.", 6000, false],
    ],
    hamburgers: [
      ["Oseb", "2 slices, archaar, polony & chips.", 1500, false],
      ["Sphiwe", "2 slices, archaar, polony, egg & chips.", 1800, false],
      ["Boity", "2 slices, archaar, polony, cheese & chips.", 2000, true],
      ["Ntombi", "2 slices, archaar, polony, vienna & chips.", 2200, false],
      ["Mantooa", "2 slices, archaar, polony, russian & chips.", 2500, false],
      ["Katekane", "2 slices, archaar, polony, fatty & chips.", 2500, false],
    ],
    "wrap-kota": [
      ["Vienna Wrap", "Lettuce, tomato, red onion, polony, cheese, vienna & chips.", 4000, false],
      ["Vienna Egg Wrap", "Lettuce, tomato, red onion, polony, cheese, vienna, egg & chips.", 4500, false],
      ["Russian Wrap", "Lettuce, tomato, red onion, polony, cheese, russian & chips.", 5000, true],
      ["Russian Egg Wrap", "Lettuce, tomato, red onion, polony, cheese, russian, egg & chips.", 5500, false],
      ["Patty Wrap", "Lettuce, tomato, red onion, cheese, patty, egg & chips.", 6000, false],
    ],
    shawarma: [
      ["Chicken Shawarma", "Flame-grilled chicken, garlic sauce, chips & pickles in a toasted wrap.", 6000, true],
      ["Wors Shawarma", "Boerewors twisted shawarma-style with garlic sauce & chips.", 6000, true],
      ["Russian Shawarma", "Sliced russian, garlic sauce, chips & pickles.", 6000, false],
    ],
    "burgers-wings": [
      ["Twiggy's Double Cheeseburger n Chips", "Double patty, double cheese, lettuce & tomato with a side of chips.", 6000, true],
      ["Twiggy's Double Cheeseburger, Chips & Wings", "The double cheeseburger meal plus two sticky buffalo wings.", 8500, false],
      ["Vali's Wings n Chips", "Sticky buffalo wings piled over hot chips.", 5000, false],
      ["Babalaas Chilli Cheese Fries", "Chips smothered in chilli beef, cheese sauce & onion. The cure.", 6000, true],
    ],
    "box-meals": [
      ["Rich Kota + Aquelle Drink", "Polony, archaar, chips, ½ cheese, ½ russian & ½ vienna with an ice-cold Aquelle.", 4000, false],
      ["Rich Private + Aquelle Drink", "Archaar, lettuce, tomato, polony, chips, full cheese, full vienna, special garlic + Aquelle.", 5000, true],
      ["Rich Share Box 1", "Chicken or wors shawarma, chips & wings.", 8000, false],
      ["Rich Share Box 2", "Chicken or wors shawarma, worsroll, chips & wings.", 12000, false],
      ["Rich Share Box 3", "Chicken shawarma, wors shawarma, wings, chips & russian bites.", 16000, true],
      ["Rich Meaty Box", "The big one: wors, wings, chips, bites & all the sauces.", 18000, false],
    ],
    breakfast: [
      ["Two Eggs & Toast", "Two eggs your way with buttered toast.", 3000, false],
      ["Egg, Bacon & Toast", "Fried eggs, crispy bacon and buttered toast.", 4000, true],
      ["Full Richie Breakfast", "Two eggs, bacon, wors, tomato, toast & a side of chips.", 5500, false],
    ],
    "hearty-meals": [
      ["¼ Chicken Leg & Chips", "Flame-grilled quarter chicken leg with hot chips.", 4000, false],
      ["Greek Salad + ¼ Chicken Leg", "Fresh greek salad topped with a grilled quarter leg.", 5000, false],
      ["Half Chicken & Chips", "Half flame-grilled chicken, chips & gravy.", 7000, true],
    ],
  };

  for (let i = 0; i < catDefs.length; i++) {
    const c = catDefs[i];
    const [cat] = await db
      .insert(categories)
      .values({ ...c, sortOrder: i })
      .returning();
    const items = itemDefs[c.slug] ?? [];
    for (let j = 0; j < items.length; j++) {
      const [name, description, priceCents, popular] = items[j];
      await db
        .insert(menuItems)
        .values({ categoryId: cat.id, name, description, priceCents, popular, sortOrder: j });
    }
  }

  await db.insert(extras).values([
    { name: "Add 2 Buffalo Wings", priceCents: 1500 },
    { name: "Extra Cheese Slab", priceCents: 800 },
    { name: "Extra Archaar", priceCents: 1000 },
    { name: "Extra Russian", priceCents: 1200 },
    { name: "Ice-cold Aquelle Drink", priceCents: 1500 },
  ]);

  console.log("Seeded Richie Rich menu:", catDefs.length, "categories");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
