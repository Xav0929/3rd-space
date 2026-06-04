import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: { type: String, default: "" },
  available: { type: Boolean, default: true },
});

const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);

const menuItems = [
  // HOUSE PLATES
  {
    name: "Crispy Liempo",
    description: "Served with rice, sides, and appetizer",
    price: 170,
    category: "House Plates",
  },
  {
    name: "Fried Chicken",
    description: "Served with rice, sides, and appetizer",
    price: 170,
    category: "House Plates",
  },
  // SAVORY MEALS
  {
    name: "Bacon & Luncheon",
    description: "Served with rice and egg",
    price: 149,
    category: "Savory Meals",
  },
  {
    name: "Tapa (Beef/Chicken)",
    description: "Served with rice and egg",
    price: 149,
    category: "Savory Meals",
  },
  {
    name: "Beef Flakes",
    description: "Served with rice and egg",
    price: 149,
    category: "Savory Meals",
  },
  {
    name: "Longganisa (Garlic/Hamonado)",
    description: "Served with rice and egg",
    price: 149,
    category: "Savory Meals",
  },
  {
    name: "Glazed Chicken Pops",
    description: "Served with rice and egg",
    price: 149,
    category: "Savory Meals",
  },
  {
    name: "Hungarian Sausage",
    description: "Served with rice and egg",
    price: 149,
    category: "Savory Meals",
  },
  // PASTA
  {
    name: "Beef Chili Pasta",
    description: "Pasta with beef chili sauce",
    price: 160,
    category: "Pasta",
  },
  {
    name: "Spanish Sardines Pasta",
    description: "Pasta with Spanish sardines",
    price: 160,
    category: "Pasta",
  },
  {
    name: "Creamy Meatballs Pasta",
    description: "Pasta with creamy meatballs",
    price: 160,
    category: "Pasta",
  },
  // NOODLES & SOUP
  {
    name: "Canton Al Uovo",
    description: "Noodles & soup",
    price: 70,
    category: "Noodles & Soup",
  },
  {
    name: "Ramen",
    description: "Noodles & soup",
    price: 130,
    category: "Noodles & Soup",
  },
  // APPETIZERS
  {
    name: "Hash Brown",
    description: "Crispy hash brown",
    price: 70,
    category: "Appetizers & Snack Platters",
  },
  {
    name: "Nuggets & Fries",
    description: "Chicken nuggets with fries",
    price: 100,
    category: "Appetizers & Snack Platters",
  },
  {
    name: "Poppers & Fries",
    description: "Jalapeño poppers with fries",
    price: 100,
    category: "Appetizers & Snack Platters",
  },
  {
    name: "Fries (À La Carte)",
    description: "Plain fries",
    price: 100,
    category: "Appetizers & Snack Platters",
  },
  {
    name: "Mixed Platter",
    description: "Nuggets, poppers, and fries",
    price: 200,
    category: "Appetizers & Snack Platters",
  },
  // ADD-ONS (FOOD)
  { name: "Egg", description: "Add-on egg", price: 15, category: "Add-Ons" },
  { name: "Rice", description: "Add-on rice", price: 20, category: "Add-Ons" },
  // COFFEE
  {
    name: "Americano (Hot)",
    description: "Classic hot americano",
    price: 79,
    category: "Coffee",
  },
  {
    name: "Americano (Iced)",
    description: "Classic iced americano",
    price: 89,
    category: "Coffee",
  },
  {
    name: "Café Latte (Hot)",
    description: "Espresso with steamed milk",
    price: 109,
    category: "Coffee",
  },
  {
    name: "Café Latte (Iced)",
    description: "Espresso with cold milk",
    price: 119,
    category: "Coffee",
  },
  {
    name: "Spanish Latte (Hot)",
    description: "Espresso with condensed milk",
    price: 129,
    category: "Coffee",
  },
  {
    name: "Spanish Latte (Iced)",
    description: "Iced espresso with condensed milk",
    price: 139,
    category: "Coffee",
  },
  {
    name: "Caramel Latte (Hot)",
    description: "Latte with caramel syrup",
    price: 139,
    category: "Coffee",
  },
  {
    name: "Caramel Latte (Iced)",
    description: "Iced latte with caramel syrup",
    price: 149,
    category: "Coffee",
  },
  {
    name: "Roasted Almond (Hot)",
    description: "Latte with roasted almond flavor",
    price: 139,
    category: "Coffee",
  },
  {
    name: "Roasted Almond (Iced)",
    description: "Iced latte with roasted almond flavor",
    price: 149,
    category: "Coffee",
  },
  {
    name: "Caramel Macchiato (Hot)",
    description: "Layered espresso with vanilla and caramel",
    price: 139,
    category: "Coffee",
  },
  {
    name: "Caramel Macchiato (Iced)",
    description: "Iced layered espresso with vanilla and caramel",
    price: 149,
    category: "Coffee",
  },
  {
    name: "Mocha (Hot)",
    description: "Espresso with chocolate",
    price: 139,
    category: "Coffee",
  },
  {
    name: "Mocha (Iced)",
    description: "Iced espresso with chocolate",
    price: 149,
    category: "Coffee",
  },
  {
    name: "White Choco (Hot)",
    description: "Latte with white chocolate",
    price: 139,
    category: "Coffee",
  },
  {
    name: "White Choco (Iced)",
    description: "Iced latte with white chocolate",
    price: 149,
    category: "Coffee",
  },
  {
    name: "Seasalt Latte (Hot)",
    description: "Latte with a hint of sea salt",
    price: 149,
    category: "Coffee",
  },
  {
    name: "Seasalt Latte (Iced)",
    description: "Iced latte with a hint of sea salt",
    price: 159,
    category: "Coffee",
  },
  {
    name: "Biscoff Latte (Hot)",
    description: "Latte with Biscoff spread",
    price: 159,
    category: "Coffee",
  },
  {
    name: "Biscoff Latte (Iced)",
    description: "Iced latte with Biscoff spread",
    price: 169,
    category: "Coffee",
  },
  // NON-COFFEE
  {
    name: "Chocolate Milk (Hot)",
    description: "Warm chocolate milk",
    price: 139,
    category: "Non-Coffee",
  },
  {
    name: "Chocolate Milk (Iced)",
    description: "Iced chocolate milk",
    price: 149,
    category: "Non-Coffee",
  },
  {
    name: "Strawberry Milk (Iced)",
    description: "Iced strawberry milk",
    price: 149,
    category: "Non-Coffee",
  },
  {
    name: "Creamy Biscoff (Iced)",
    description: "Iced creamy Biscoff drink",
    price: 189,
    category: "Non-Coffee",
  },
  {
    name: "Banana Oat Cream (Iced)",
    description: "Iced banana oat cream drink",
    price: 189,
    category: "Non-Coffee",
  },
  // TEA COLLECTION
  {
    name: "Four Red Tea (Hot)",
    description: "Blend of four red teas",
    price: 99,
    category: "Tea Collection",
  },
  {
    name: "Four Red Tea (Iced)",
    description: "Iced blend of four red teas",
    price: 109,
    category: "Tea Collection",
  },
  {
    name: "Green Tea (Hot)",
    description: "Classic green tea",
    price: 99,
    category: "Tea Collection",
  },
  {
    name: "Green Tea (Iced)",
    description: "Iced green tea",
    price: 109,
    category: "Tea Collection",
  },
  {
    name: "Lemon and Ginger (Hot)",
    description: "Lemon and ginger herbal tea",
    price: 99,
    category: "Tea Collection",
  },
  {
    name: "Lemon and Ginger (Iced)",
    description: "Iced lemon and ginger tea",
    price: 109,
    category: "Tea Collection",
  },
  {
    name: "Peppermint (Hot)",
    description: "Soothing peppermint tea",
    price: 99,
    category: "Tea Collection",
  },
  {
    name: "Peppermint (Iced)",
    description: "Iced peppermint tea",
    price: 109,
    category: "Tea Collection",
  },
  // MATCHA SERIES
  {
    name: "Matcha Latte (Hot)",
    description: "Classic hot matcha latte",
    price: 139,
    category: "Matcha Series",
  },
  {
    name: "Matcha Latte (Iced)",
    description: "Classic iced matcha latte",
    price: 149,
    category: "Matcha Series",
  },
  {
    name: "Strawberry Matcha (Hot)",
    description: "Matcha with strawberry",
    price: 149,
    category: "Matcha Series",
  },
  {
    name: "Strawberry Matcha (Iced)",
    description: "Iced matcha with strawberry",
    price: 159,
    category: "Matcha Series",
  },
  {
    name: "Seasalt Matcha (Hot)",
    description: "Matcha with sea salt cream",
    price: 159,
    category: "Matcha Series",
  },
  {
    name: "Seasalt Matcha (Iced)",
    description: "Iced matcha with sea salt cream",
    price: 169,
    category: "Matcha Series",
  },
  // OATMILK SERIES
  {
    name: "Apple Oatmilk",
    description: "Apple-flavored oat milk drink",
    price: 119,
    category: "Oatmilk Series",
  },
  {
    name: "Blueberry Bliss Oat",
    description: "Blueberry oat milk drink",
    price: 119,
    category: "Oatmilk Series",
  },
  {
    name: "Golden Peach Oat",
    description: "Peach oat milk drink",
    price: 119,
    category: "Oatmilk Series",
  },
  // 3RD SPACE CREATIONS
  {
    name: "Creamy Shot",
    description: "3rd Space signature creation",
    price: 100,
    category: "3rd Space Creations",
  },
  {
    name: "White Drift",
    description: "3rd Space signature creation",
    price: 100,
    category: "3rd Space Creations",
  },
  {
    name: "Berry Risky",
    description: "3rd Space signature creation",
    price: 100,
    category: "3rd Space Creations",
  },
  {
    name: "Orange Americano",
    description: "3rd Space signature creation",
    price: 100,
    category: "3rd Space Creations",
  },
  // FLAVORED SODA
  {
    name: "Blueberry Soda",
    description: "Blueberry flavored soda",
    price: 99,
    category: "Flavored Soda",
  },
  {
    name: "Green Apple Soda",
    description: "Green apple flavored soda",
    price: 99,
    category: "Flavored Soda",
  },
  {
    name: "Honey Peach Soda",
    description: "Honey peach flavored soda",
    price: 99,
    category: "Flavored Soda",
  },
  {
    name: "Lemon Soda",
    description: "Lemon flavored soda",
    price: 99,
    category: "Flavored Soda",
  },
  // BRAIN FUEL
  {
    name: "Focus Float",
    description: "Espresso poured over vanilla ice cream",
    price: 129,
    category: "Brain Fuel",
  },
  {
    name: "Mood Bar",
    description: "Brownies topped with vanilla ice cream drizzled with caramel",
    price: 129,
    category: "Brain Fuel",
  },
  // ADD-ONS (DRINKS)
  {
    name: "Espresso Shots (Add-On)",
    description: "Extra espresso shots",
    price: 30,
    category: "Add-Ons",
  },
  {
    name: "Syrup (Add-On)",
    description: "Flavored syrup add-on",
    price: 30,
    category: "Add-Ons",
  },
  {
    name: "Sauce (Add-On)",
    description: "Sauce add-on",
    price: 30,
    category: "Add-Ons",
  },
  {
    name: "Vanilla Ice Cream (Add-On)",
    description: "Vanilla ice cream add-on",
    price: 30,
    category: "Add-Ons",
  },
  // SUBSTITUTIONS
  {
    name: "Oatmilk Substitution",
    description: "Substitute regular milk with oat milk",
    price: 50,
    category: "Substitutions",
  },
  {
    name: "Matcha Substitution",
    description: "Substitute with matcha base",
    price: 50,
    category: "Substitutions",
  },
];

export async function GET() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }

    await MenuItem.deleteMany({});
    await MenuItem.insertMany(
      menuItems.map((item) => ({ ...item, image: "", available: true })),
    );

    return NextResponse.json({
      success: true,
      message: `Seeded ${menuItems.length} menu items`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
