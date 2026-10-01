const { port } = require('../config/env');

const objectIdParam = (description) => ({
  name: 'id',
  in: 'path',
  required: true,
  description,
  schema: { $ref: '#/components/schemas/ObjectId' },
});

const errorResponse = (description, status, message) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: { error: { status, message } },
    },
  },
});

const exampleCategory = { _id: '6650a1f2c3b4d5e6f7a8b901', name: 'Backend', slug: 'backend' };

const exampleCourse = {
  _id: '6650a1f2c3b4d5e6f7a8b902',
  title: 'Node.js & Express REST APIs',
  slug: 'node-js-express-rest-apis',
  description:
    'Design and build RESTful APIs with Node.js and Express: routing, middlewares, validation and error handling.',
  category: exampleCategory,
  level: 'intermediate',
  tags: ['nodejs', 'express', 'rest', 'api'],
  durationHours: 18,
  trainer: { name: 'Karim Ouazzani', email: 'karim.ouazzani@lms.dev' },
  status: 'published',
  publishedAt: '2026-03-01T09:00:00.000Z',
  createdAt: '2026-02-20T10:00:00.000Z',
  updatedAt: '2026-03-01T09:00:00.000Z',
};

const exampleModule = {
  _id: '6650a1f2c3b4d5e6f7a8b903',
  course: exampleCourse._id,
  title: 'Express Routing and Middlewares',
  description: 'Routers, middlewares and the request lifecycle.',
  order: 2,
  createdAt: '2026-02-20T10:00:00.000Z',
  updatedAt: '2026-02-20T10:00:00.000Z',
};

const exampleResource = {
  _id: '6650a1f2c3b4d5e6f7a8b904',
  module: exampleModule._id,
  title: 'Express routing guide',
  type: 'article',
  url: 'https://expressjs.com/en/guide/routing.html',
  durationMinutes: 20,
  order: 1,
  createdAt: '2026-02-20T10:00:00.000Z',
  updatedAt: '2026-02-20T10:00:00.000Z',
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'LMS API - Course catalog',
    version: '0.1.0',
    description:
      'Phase 1 read-only course catalog of the Learning Management System. ' +
      'All endpoints are public (no authentication in Phase 1). ' +
      'Only courses with status `published` are exposed.',
  },
  servers: [{ url: `http://localhost:${port}/api`, description: 'Local development' }],
  tags: [
    { name: 'Courses', description: 'Published course catalog' },
    { name: 'Modules', description: 'Course modules and their resources' },
    { name: 'Categories', description: 'Course categories' },
  ],
  paths: {
    '/courses': {
      get: {
        tags: ['Courses'],
        summary: 'List published courses',
        description: 'Returns published courses, with optional filtering, sorting and pagination.',
        parameters: [
          {
            name: 'category',
            in: 'query',
            description: 'Category slug (e.g. `backend`) or id',
            schema: { type: 'string' },
            example: 'backend',
          },
          {
            name: 'level',
            in: 'query',
            description: 'Course level',
            schema: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
          },
          {
            name: 'keyword',
            in: 'query',
            description: 'Case-insensitive search in title, description and tags',
            schema: { type: 'string' },
            example: 'node',
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Sort field; prefix with `-` for descending order',
            schema: {
              type: 'string',
              enum: ['createdAt', '-createdAt', 'publishedAt', '-publishedAt'],
              default: '-publishedAt',
            },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number (starts at 1)',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Items per page (max 50)',
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'Paginated list of published courses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Course' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
                example: {
                  data: [exampleCourse],
                  meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
                },
              },
            },
          },
          400: errorResponse(
            'Invalid query parameter',
            400,
            'level must be one of: beginner, intermediate, advanced',
          ),
        },
      },
    },
    '/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get a published course',
        parameters: [objectIdParam('Course id')],
        responses: {
          200: {
            description: 'Course details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Course' } },
                },
                example: { data: exampleCourse },
              },
            },
          },
          400: errorResponse('Invalid id', 400, 'Invalid id: abc'),
          404: errorResponse(
            'Course not found or not published',
            404,
            'Course not found: 6650a1f2c3b4d5e6f7a8b902',
          ),
        },
      },
    },
    '/courses/{id}/modules': {
      get: {
        tags: ['Courses', 'Modules'],
        summary: 'List the modules of a published course',
        description: 'Modules are sorted by `order`.',
        parameters: [objectIdParam('Course id')],
        responses: {
          200: {
            description: 'Modules of the course',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Module' } },
                    meta: { $ref: '#/components/schemas/ListMeta' },
                  },
                },
                example: { data: [exampleModule], meta: { total: 1 } },
              },
            },
          },
          400: errorResponse('Invalid id', 400, 'Invalid id: abc'),
          404: errorResponse(
            'Course not found or not published',
            404,
            'Course not found: 6650a1f2c3b4d5e6f7a8b902',
          ),
        },
      },
    },
    '/modules/{id}/resources': {
      get: {
        tags: ['Modules'],
        summary: 'List the resources of a module',
        description: 'Resources are sorted by `order`. The module must belong to a published course.',
        parameters: [objectIdParam('Module id')],
        responses: {
          200: {
            description: 'Resources of the module',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Resource' } },
                    meta: { $ref: '#/components/schemas/ListMeta' },
                  },
                },
                example: { data: [exampleResource], meta: { total: 1 } },
              },
            },
          },
          400: errorResponse('Invalid id', 400, 'Invalid id: abc'),
          404: errorResponse(
            'Module not found or its course is not published',
            404,
            'Module not found: 6650a1f2c3b4d5e6f7a8b903',
          ),
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List categories',
        description: 'Useful to build the `category` filter of `GET /courses`.',
        responses: {
          200: {
            description: 'All categories sorted by name',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
                    meta: { $ref: '#/components/schemas/ListMeta' },
                  },
                },
                example: { data: [exampleCategory], meta: { total: 1 } },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ObjectId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '6650a1f2c3b4d5e6f7a8b902' },
      Category: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
        },
      },
      Course: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          title: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          category: { $ref: '#/components/schemas/Category' },
          level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
          tags: { type: 'array', items: { type: 'string' } },
          durationHours: { type: 'number' },
          trainer: {
            type: 'object',
            properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' } },
          },
          status: { type: 'string', enum: ['published'] },
          publishedAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Module: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          course: { $ref: '#/components/schemas/ObjectId' },
          title: { type: 'string' },
          description: { type: 'string' },
          order: { type: 'integer', minimum: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Resource: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          module: { $ref: '#/components/schemas/ObjectId' },
          title: { type: 'string' },
          type: { type: 'string', enum: ['video', 'article', 'pdf', 'link'] },
          url: { type: 'string', format: 'uri' },
          durationMinutes: { type: 'number' },
          order: { type: 'integer', minimum: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      ListMeta: {
        type: 'object',
        properties: { total: { type: 'integer' } },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            required: ['status', 'message'],
            properties: {
              status: { type: 'integer' },
              message: { type: 'string' },
              details: {},
            },
          },
        },
      },
    },
  },
};
