const app = require('./app');
const { port, mongoUri } = require('./config/env');
const { connectDB } = require('./config/db');

async function start() {
  try {
    await connectDB(mongoUri);
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`LMS API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err.message);
    process.exit(1);
  }
}

start();
