const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');
const { connectDB, disconnectDB } = require('../config/db');
const { Category, Course, Module, Resource } = require('../models');
const data = require('./data');

async function clearCatalog() {
  await Promise.all([
    Resource.deleteMany({}),
    Module.deleteMany({}),
    Course.deleteMany({}),
    Category.deleteMany({}),
  ]);
}

async function seedCatalog({ categories, courses } = data) {
  const createdCategories = await Category.create(categories);
  const categoryIdByName = new Map(createdCategories.map((c) => [c.name, c._id]));

  const counts = { categories: createdCategories.length, courses: 0, modules: 0, resources: 0 };

  for (const { modules = [], category, ...courseData } of courses) {
    const course = await Course.create({ ...courseData, category: categoryIdByName.get(category) });
    counts.courses += 1;

    for (const [moduleIndex, { resources = [], ...moduleData }] of modules.entries()) {
      const mod = await Module.create({ ...moduleData, course: course._id, order: moduleIndex + 1 });
      counts.modules += 1;

      const createdResources = await Resource.create(
        resources.map((resource, resourceIndex) => ({
          ...resource,
          module: mod._id,
          order: resourceIndex + 1,
        })),
      );
      counts.resources += createdResources.length;
    }
  }

  return counts;
}

async function run({ reset = false } = {}) {
  await connectDB(mongoUri);
  console.log(`Connected to ${mongoose.connection.name}`);

  if (reset) {
    await mongoose.connection.dropDatabase();
    console.log('Database dropped');
  } else {
    await clearCatalog();
    console.log('Catalog collections cleared');
  }

  await Promise.all([Category, Course, Module, Resource].map((model) => model.syncIndexes()));

  const counts = await seedCatalog();
  console.log(
    `Seeded ${counts.categories} categories, ${counts.courses} courses, ` +
      `${counts.modules} modules and ${counts.resources} resources`,
  );
}

if (require.main === module) {
  run({ reset: process.argv.includes('--reset') })
    .catch((err) => {
      console.error('Seeding failed:', err.message);
      process.exitCode = 1;
    })
    .finally(disconnectDB);
}

module.exports = { clearCatalog, seedCatalog };
