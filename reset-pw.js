require("dotenv").config({ path: ".env.local" }); // or ".env" — match your actual filename
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  const newPasswordHash = await bcrypt.hash("newpassword123", 10);

  const result = await db
    .collection("accounts")
    .updateOne(
      { username: "admin" },
      { $set: { passwordHash: newPasswordHash } },
    );

  console.log(
    "Matched:",
    result.matchedCount,
    "Modified:",
    result.modifiedCount,
  );
  await client.close();
}

run();
