const { Category } = require('../models');

async function listCategories(req, res) {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ data: categories, meta: { total: categories.length } });
}

module.exports = { listCategories };
