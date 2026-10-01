# LMS API

Backend of a Learning Management System (LMS) built with **Node.js**, **Express** and **MongoDB (Mongoose)**.

This repository is developed in 3 phases. **Phase 1** (current) is foundational:

- project architecture and local infrastructure,
- global UML design (`docs/`),
- database structure (Course, Module, Resource),
- a **read-only course catalog API**.

Real authentication and the full LMS feature set are out of scope for Phase 1.

## Design documentation

The product analysis and UML design live in [`docs/`](docs/README.md):

- [Product analysis & backlog](docs/analysis-backlog.md)
- [Class diagram](docs/class-diagram.md)
- [Use case diagram](docs/use-case-diagram.md)
- [Course enrollment sequence diagram](docs/sequence-enrollment.md)

## Prerequisites

- Node.js >= 20 and npm
- Docker + Docker Compose (for the local MongoDB instance)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env

# 3. Start MongoDB (docker compose)
npm run db:up        # or: docker compose up -d mongo

# 4. Populate the database with sample web development courses
npm run seed

# 5. Run the API
npm run dev          # with auto-reload (nodemon)
# or
npm start
```

The API listens on `http://localhost:3000` by default. Check it with:

```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

## Data model & seeding

Phase 1 implements the catalog part of the [class diagram](docs/class-diagram.md):

| Model      | Main fields | Relations |
| ---------- | ----------- | --------- |
| `Category` | name (unique), slug, description | has many courses |
| `Course`   | title, slug (unique, generated), description, level (`beginner`/`intermediate`/`advanced`), tags, durationHours, trainer `{ name, email }`, status (`draft`/`published`/`archived`), publishedAt | belongs to a category, has many modules |
| `Module`   | title, description, order (unique per course) | belongs to a course, has many resources |
| `Resource` | title, type (`video`/`article`/`pdf`/`link`), url (http/https), durationMinutes, order (unique per module) | belongs to a module |

> The trainer is embedded in the course as `{ name, email }` for Phase 1. It will become a reference to the `User` model when authentication is introduced in Phase 2.

- `npm run seed` clears the catalog collections and inserts realistic web development courses (published, draft and archived) with their modules and resources.
- `npm run db:reset` drops the whole database, re-creates the indexes and runs the seed.

## API

Base URL: `http://localhost:3000/api`

### Course catalog (read-only)

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/courses` | List published courses (filtering, sorting, pagination) |
| GET | `/api/courses/:id` | Get a published course with its category |
| GET | `/api/courses/:id/modules` | List the modules of a published course (sorted by `order`) |
| GET | `/api/modules/:id/resources` | List the resources of a module of a published course (sorted by `order`) |
| GET | `/api/categories` | List categories (to build the `category` filter) |
| GET | `/api/health` | Health check |

Query parameters of `GET /api/courses`:

| Parameter | Example | Description |
| --------- | ------- | ----------- |
| `category` | `backend` | Category slug or id |
| `level` | `beginner` | `beginner`, `intermediate` or `advanced` |
| `keyword` | `node` | Case-insensitive search in title, description and tags |
| `sort` | `-publishedAt` | `createdAt`, `-createdAt`, `publishedAt`, `-publishedAt` (default `-publishedAt`, `-` = descending) |
| `page` | `1` | Page number (default `1`) |
| `limit` | `10` | Items per page (default `10`, max `50`) |

```bash
curl "http://localhost:3000/api/courses?category=frontend&level=beginner&sort=publishedAt&page=1&limit=5"
```

```json
{
  "data": [{ "_id": "...", "title": "HTML & CSS Fundamentals", "level": "beginner", "category": { "name": "Frontend", "slug": "frontend" }, "...": "..." }],
  "meta": { "total": 2, "page": 1, "limit": 5, "totalPages": 1 }
}
```

Draft and archived courses (and their modules/resources) are never exposed: they return `404`.

### Errors

Every error returns a consistent JSON body with the matching HTTP status code:

```json
{ "error": { "status": 404, "message": "Course not found: 6650a1f2c3b4d5e6f7a8b902" } }
```

| Status | When |
| ------ | ---- |
| `400` | Invalid id or query parameter, Mongoose validation error (with `details`) |
| `404` | Unknown route, or course/module not found or not published |
| `409` | Duplicate value (unique index) |
| `500` | Unexpected error (message hidden, stack trace only in `development`) |

### Authentication

There is **no authentication in Phase 1**: all routes are public and read-only. No trainer CRUD routes are exposed; course data is managed through the seed script. Authentication, roles and trainer course management are planned for Phase 2 (see the [backlog](docs/analysis-backlog.md)).

### Swagger / OpenAPI

Interactive documentation is available at **http://localhost:3000/api-docs** (raw OpenAPI document: `/api-docs.json`).

## Tests

```bash
npm test
```

Tests use Node's built-in test runner with [Supertest](https://github.com/ladjs/supertest) and [mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server): they start an in-memory MongoDB (no Docker needed, the binary is downloaded on the first run), load the seed data and exercise every catalog route.

Stop the database with `npm run db:down` (data is kept in the `mongo-data` docker volume).

## Environment variables

| Variable    | Default                            | Description               |
| ----------- | ---------------------------------- | ------------------------- |
| `NODE_ENV`  | `development`                      | Runtime environment       |
| `PORT`      | `3000`                             | HTTP port of the API      |
| `MONGO_URI` | `mongodb://localhost:27017/lms`    | MongoDB connection string |

Never commit your `.env` file; only `.env.example` is versioned.

## Project structure

```
.
├── docker-compose.yml     # Local MongoDB
├── docs/                  # Product analysis & UML diagrams
├── .env.example
├── tests/                 # API tests
└── src
    ├── app.js             # Express app (middlewares + routes)
    ├── server.js          # HTTP server entry point
    ├── config/            # Environment & database configuration
    ├── routes/            # Express routers
    ├── controllers/       # Request handlers
    ├── models/            # Mongoose models
    ├── middlewares/       # Express middlewares (notFound, errorHandler, ...)
    ├── docs/              # OpenAPI specification
    ├── seed/              # Seed data and script
    └── utils/             # Small helpers
```

## npm scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm start`       | Start the API                    |
| `npm run dev`     | Start the API with nodemon       |
| `npm test`        | Run the automated tests          |
| `npm run seed`    | Seed the catalog with sample data |
| `npm run db:reset`| Drop the database and re-seed    |
| `npm run db:up`   | Start MongoDB with Docker        |
| `npm run db:down` | Stop MongoDB                     |

## Git workflow

- `main` is protected and must stay stable.
- Each task is developed on a dedicated, sequential feature branch (`feat/init-config`, `feat/uml-conception`, `feat/models-seed`, `feat/catalog-routes`) and merged through a pull request.
- Commits are atomic with explicit messages (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
