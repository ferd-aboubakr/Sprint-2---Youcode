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

# 4. Run the API
npm run dev          # with auto-reload (nodemon)
# or
npm start
```

The API listens on `http://localhost:3000` by default. Check it with:

```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

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
| `npm run db:up`   | Start MongoDB with Docker        |
| `npm run db:down` | Stop MongoDB                     |

## Git workflow

- `main` is protected and must stay stable.
- Each task is developed on a dedicated, sequential feature branch (`feat/init-config`, `feat/uml-conception`, `feat/models-seed`, `feat/catalog-routes`) and merged through a pull request.
- Commits are atomic with explicit messages (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
