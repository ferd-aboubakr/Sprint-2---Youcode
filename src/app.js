const express = require('express');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const openapi = require('./docs/openapi');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/api-docs.json', (req, res) => res.json(openapi));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
