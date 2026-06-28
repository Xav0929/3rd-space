import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const COST_MAP: Record<string, number> = {
  "Fries a la carte": 50,
  "Hash Brown": 50,
  "Mixed Platter": 150,
  "Nuggets & Fries": 70,
  "Poppers & Fries": 70,
  "Crispy liempo": 130,
  "Fried Chicken": 130,
  "Biscoff 2 pcs": 40,
  "Biscoff 4pcs": 80,
  "Caramel 2pcs": 30,
  "Caramel 4pcs": 60,
  "Classic 2pcs": 20,
  "Classic 4pcs": 40,
  "Grilled Sandwich": 100,
  "Bacon & LM": 100,
  "Beef Flakes": 120,
  "Beef Tapa": 82,
  "Chicken Tapa": 82,
  "Garlic Longganisa": 120,
  "Glazed Chick Poppers": 100,
  "Hamonado Longganisa": 120,
  "Hungarian Sausage": 120,
  Egg: 10,
  Rice: 15,
  "Canton al Uovo": 50,
  "Pochero barkada": 200,
  "Pochero solo": 100,
  Ramen: 90,
  "Beef Chili": 100,
  "Meatballs Spaghetti": 100,
  "Spanish Sardines": 100,
  "Berry Risky": 80,
  "Creamy Shot": 80,
  "Orange Americano": 80,
  "White Drift": 80,
  Blueberry: 50,
  Greenapple: 50,
  Honeypeach: 50,
  Lemon: 50,
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
  "Roasted Almond": 90,
  "Seasalt Latte": 75,
  "Seasalt Matcha": 100,
  "Spanish Latte": 45,
  "Strawberry Matcha": 100,
  "White Choco": 70,
  "Banana Oat Cream": 150,
  "Biscoff latte": 140,
  "Caramel Machiatto": 85,
  "Creamy biscoff": 120,
  "Sea Salt Latte": 82,
  "Strawberry Milk": 120,
  "c&c matcha": 100,
  "strawberry matcha": 100,
  "Hot Matcha Latte": 110,
  "Hot Seasalt Matcha": 130,
  "Hot StrawberryMatcha": 120,
  "Iced Matcha Latte": 120,
  "Iced Seasalt Matcha": 140,
  IcedStrawberryMatcha: 130,
  "Creamy Biscoff": 140,
  "Hot Chocolate Milk": 110,
  "Iced Chocolate Milk": 110,
  Apple: 80,
  "Blueberry Bliss": 80,
  "Honey Peach": 80,
  "Hot Green Tea": 45,
  "Hot Lemon & Ginger": 45,
  "Hot Peppermint": 45,
  "Hot Red Tea": 45,
  "Iced Green Tea": 57,
  "Iced Lemon & Ginger": 57,
  "Iced Peppermint": 57,
  "Iced Red Tea": 57,
  "Focus Float": 34,
  "Mood Bar": 80,
  Chillsung: 23,
  Milkis: 23,
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
};

export async function POST() {
  try {
    await connectDB();
    const col = mongoose.connection.db!.collection("menuitems");

    let updated = 0;
    const missed: string[] = [];

    for (const [name, cost] of Object.entries(COST_MAP)) {
      const result = await col.updateMany(
        {
          name: {
            $regex: new RegExp(
              `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
              "i",
            ),
          },
        },
        { $set: { cost } },
      );
      if (result.modifiedCount > 0) {
        updated += result.modifiedCount;
      } else {
        missed.push(name);
      }
    }

    return NextResponse.json({ ok: true, updated, missed });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
