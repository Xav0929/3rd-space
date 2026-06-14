import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://yuriesb01_db_user:r7vAXkW7VbIqa9bj@cluster0.iprpzs6.mongodb.net/3rd-space?retryWrites=true&w=majority";
const OLD_URL = "https://pub-9f10feaff9e04a53b72e9a2d79b24eaa.r2.dev";
const NEW_URL = "https://3rdspace.shop/cdn";

const client = new MongoClient(MONGODB_URI);

function replaceUrls(value) {
  if (typeof value === "string") {
    return value.replaceAll(OLD_URL, NEW_URL);
  }
  if (Array.isArray(value)) {
    return value.map(replaceUrls);
  }
  if (value && typeof value === "object") {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = replaceUrls(v);
    }
    return result;
  }
  return value;
}

async function migrate() {
  await client.connect();
  const db = client.db("3rd-space");

  const collections = await db.listCollections().toArray();
  console.log(`Found ${collections.length} collections`);

  for (const { name } of collections) {
    const col = db.collection(name);
    const docs = await col.find({}).toArray();
    let updated = 0;

    for (const doc of docs) {
      const { _id, ...rest } = doc;
      const newDoc = replaceUrls(rest);
      const before = JSON.stringify(rest);
      const after = JSON.stringify(newDoc);

      if (before !== after) {
        await col.updateOne({ _id }, { $set: newDoc });
        updated++;
      }
    }

    console.log(`${name}: ${updated}/${docs.length} docs updated`);
  }

  await client.close();
  console.log("Done.");
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
