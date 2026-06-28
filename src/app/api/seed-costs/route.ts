import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const COST_MAP: Record<string, number> = {
  // A - Appetizer & Snack Platters
  "Fries a la carte": 50,
  "Hash Brown": 50,
  "Mixed Platter": 150,
  "Nuggets & Fries": 70,
  "Poppers & Fries": 70,
  // A - House Plates
  "Crispy liempo": 130,
  "Fried Chicken": 130,
  // A - Pancake/Sandwich
  "Biscoff 2 pcs": 40,
  "Biscoff 4pcs": 80,
  "Caramel 2pcs": 30,
  "Caramel 4pcs": 60,
  "Classic 2pcs": 20,
  "Classic 4pcs": 40,
  "Grilled Sandwich": 100,
  // A - Savory Meals
  "Bacon & LM": 100,
  "Beef Flakes": 120,
  "Beef Tapa": 82,
  "Chicken Tapa": 82,
  Tapa: 82, // alias — menu now just shows "Tapa"
  "Garlic Longganisa": 120,
  "Glazed Chick Poppers": 100,
  "Glazed Chicken Pops": 100, // alias — renamed in menu
  "Hamonado Longganisa": 120,
  "Hungarian Sausage": 120,
  // Add Ons
  Egg: 10,
  Rice: 15,
  // B - Noodles & Soups
  "Canton al Uovo": 50,
  "Pochero barkada": 200,
  "Pochero solo": 100,
  Ramen: 90,
  // B - Pasta
  "Beef Chili": 100,
  "Meatballs Spaghetti": 100,
  "Spanish Sardines": 100,
  // C - 3rd Space Creations
  "Berry Risky": 80,
  "Creamy Shot": 80,
  "Orange Americano": 80,
  "White Drift": 80,
  // C - Flavored Soda
  Blueberry: 50,
  Greenapple: 50,
  Honeypeach: 50,
  Lemon: 50,
  // C - Hot Coffee
  Americano: 27,
  "Biscoff Latte": 120,
  "Cafe Latte": 42,
  "Caramel Latte": 50,
  "Caramel Macchiato": 50,
  "Chocolate Milk": 100,
  "Cookies&Cream Matcha": 100,
  Espresso: 15,
  "Matcha Latte": 47,
  Mocha: 70,
  "Seasalt Latte": 75,
  "Seasalt Matcha": 100,
  "Spanish Latte": 45,
  "Strawberry Matcha": 100,
  "White Choco": 70,
  "Roasted Almond": 90,
  // C - Iced Coffee (unique names)
  "Banana Oat Cream": 150,
  "Biscoff latte": 140,
  "Caramel Machiatto": 85,
  "Creamy biscoff": 120,
  "Sea Salt Latte": 82,
  "Strawberry Milk": 120,
  "c&c matcha": 100,
  "strawberry matcha": 100,
  // C - Matcha Series
  "Hot Matcha Latte": 110,
  "Hot Seasalt Matcha": 130,
  "Hot StrawberryMatcha": 120,
  "Iced Matcha Latte": 120,
  "Iced Seasalt Matcha": 140,
  IcedStrawberryMatcha: 130,
  // C - Non-Coffee
  "Creamy Biscoff": 140,
  "Hot Chocolate Milk": 110,
  "Iced Chocolate Milk": 110,
  // C - Oatmilk Series
  Apple: 80,
  "Blueberry Bliss": 80,
  "Honey Peach": 80,
  "Golden Peach Oat": 80, // alias — renamed in menu
  // C - Tea Collection
  "Hot Green Tea": 45,
  "Hot Lemon & Ginger": 45,
  "Hot Peppermint": 45,
  "Hot Red Tea": 45,
  "Iced Green Tea": 57,
  "Iced Lemon & Ginger": 57,
  "Iced Peppermint": 57,
  "Iced Red Tea": 57,
  // D - Bottled Water
  "Bottled Water": 7,
  // E - Dessert
  "Focus Float": 34,
  "Mood Bar": 80,
  // E - Pastillas
  "for consignment": 10,
  retail: 10,
  // H
  "H - Coffee Beans 150g": 110,
  Chillsung: 23,
  Milkis: 23,
  // H - Pastries
  "Banana Bread": 30,
  "Banana Slice": 28,
  "Banana choco Muffin": 53,
  Brownies: 20,
  "Cake pops": 20,
  "Cheese Bread": 15,
  "Cheese roll": 20,
  "Cheesecake and Mamon": 90,
  "Choco Cinnamon": 27,
  "Classic Brownies": 33,
  Donut: 30,
  "Floss Bread": 17,
  Mamon: 90,
  "Packed cookie": 15,
  "Polvoron C&Cream": 18,
  "Polvoron Coated": 22,
  "Red Velvet": 20,
  "Ube Roll": 20,
  almond: 37,
  "brownies box": 130,
  cookies: 10,
  ensaymada: 30,
  // P - Paper
  a3: 1,
  "long 3pcs": 1,
  "short/a4": 0.4,
  // P - Print
  "Photo Copy short/a4": 1,
  "Photocopy Long": 1.5,
  "black a3": 5,
  "black a4": 2,
  "black long": 3,
  "black short": 2,
  "full color a3": 18,
  "full color a4": 7,
  "full color long": 8,
  "full color short": 7,
  "semi color a3": 10,
  "semi color a4": 4,
  "semi color long": 5,
  "semi color short": 4,
};

// Strip "(Iced)" / "(Hot)" / any parenthetical, then strip non-alphanumerics, lowercase.
function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export async function POST() {
  try {
    await connectDB();
    const col = mongoose.connection.db!.collection("menuitems");

    const normMap = new Map<string, number>();
    for (const [name, cost] of Object.entries(COST_MAP)) {
      normMap.set(normalize(name), cost);
    }

    const allItems = await col.find({}).toArray();

    let updated = 0;
    const missed: string[] = [];

    for (const item of allItems) {
      const key = normalize(item.name);
      if (normMap.has(key)) {
        await col.updateOne(
          { _id: item._id },
          { $set: { cost: normMap.get(key) } },
        );
        updated++;
      } else {
        missed.push(item.name);
      }
    }

    return NextResponse.json({ ok: true, updated, missed });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
