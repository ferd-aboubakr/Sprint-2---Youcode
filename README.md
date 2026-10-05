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
└── src
    ├── app.js             # Express app (middlewares + routes)
    ├── server.js          # HTTP server entry point
    ├── config/            # Environment & database configuration
    ├── routes/            # Express routers
    ├── controllers/       # Request handlers
    ├── models/            # Mongoose models
    └── middlewares/       # Express middlewares (errors, ...)
```

## npm scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm start`       | Start the API                    |
| `npm run dev`     | Start the API with nodemon       |
| `npm run seed`    | Seed the catalog with sample data |
| `npm run db:reset`| Drop the database and re-seed    |
| `npm run db:up`   | Start MongoDB with Docker        |
| `npm run db:down` | Stop MongoDB                     |

## Git workflow

- `main` is protected and must stay stable.
- Each task is developed on a dedicated, sequential feature branch (`feat/init-config`, `feat/uml-conception`, `feat/models-seed`, `feat/catalog-routes`) and merged through a pull request.
- Commits are atomic with explicit messages (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
