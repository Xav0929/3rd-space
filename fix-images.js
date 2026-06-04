const mongoose = require('mongoose');

const MONGODB_URI = process.argv[2];
if (!MONGODB_URI) { console.error('Usage: node fix-images.js <MONGODB_URI>'); process.exit(1); }

const imageMap = {
  'Crispy Liempo':          '/menu/food/Crispy Liempo.png',
  'Fried Chicken':          '/menu/food/Fried Chicken.png',
  'Bacon & Luncheon':       '/menu/food/Bacon and Luncheon.png',
  'Tapa (Beef/Chicken)':    '/menu/food/Tapa (Chicken and Beef).png',
  'Beef Flakes':            '/menu/food/Beef Flakes.png',
  'Hungarian Sausage':      '/menu/food/Hungarian Sausage.png',
  'Spanish Sardines Pasta': '/menu/food/Spanish Sardines Pasta.png',
  'Canton Al Uovo':         '/menu/food/Canton Al Uovo.png',
  'Ramen':                  '/menu/food/Ramen.png',
  'Hash Brown':             '/menu/food/Hash Brown.png',
  'Glazed Chicken Pops':    '/menu/food/grilled-chicken.png',
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('menuitems');
  let updated = 0, skipped = 0;
  for (const [name, imagePath] of Object.entries(imageMap)) {
    const result = await col.updateOne({ name }, { $set: { image: imagePath } });
    if (result.matchedCount > 0) { console.log('✅', name, '→', imagePath); updated++; }
    else { console.log('⚠️  NOT FOUND:', name); skipped++; }
  }
  console.log(`\nDone. Updated: ${updated}, Not found: ${skipped}`);
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
