const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function startDatabase() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function stopDatabase() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

module.exports = { startDatabase, stopDatabase };
