const mongoose = require('mongoose');
mongoose.connect(process.argv[2]).then(async () => {
  const col = mongoose.connection.db.collection('menuitems');
  const r = await col.updateOne({ name: 'Glazed Chicken Pops' }, { $set: { image: '' } });
  console.log('Updated:', r.modifiedCount);
  process.exit();
});
