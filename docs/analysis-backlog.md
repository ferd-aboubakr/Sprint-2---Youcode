# Product analysis & backlog

## 1. Vision

A Learning Management System where **trainers** publish structured web development courses, **learners** enroll, follow modules, consume resources, take quizzes and track their progress, and **admins** moderate the platform. Anonymous **visitors** can browse the public catalog.

The project is delivered in 3 phases:

| Phase | Scope |
| ----- | ----- |
| **1 (current)** | Architecture, UML design, database structure, read-only course catalog API |
| 2 | Authentication & roles, enrollment, trainer course management (CRUD) |
| 3 | Progress tracking, quizzes & attempts, feedback, admin moderation |

## 2. Core entities

| Entity | Description | Key attributes |
| ------ | ----------- | -------------- |
| **User** | Any registered account | firstName, lastName, email (unique), passwordHash, role (`learner` \| `trainer` \| `admin`), isActive |
| **Course** | A training program owned by a trainer | title, slug, description, category, level (`beginner` \| `intermediate` \| `advanced`), tags, durationHours, status (`draft` \| `published` \| `archived`), publishedAt, trainer |
| **Module** | An ordered chapter of a course | course, title, description, order |
| **Resource** | A learning material attached to a module | module, title, type (`video` \| `article` \| `pdf` \| `link`), url, durationMinutes, order |
| **Enrollment** | Link between a learner and a course | learner, course, status (`active` \| `completed` \| `cancelled`), enrolledAt, completedAt |
| **Progress** | Completion of a resource by an enrolled learner | enrollment, resource, completed, completedAt |
| **Quiz** | An evaluation attached to a module | module, title, questions[], passingScore |
| **QuizAttempt** | A learner's submission of a quiz | quiz, learner, answers[], score, passed, submittedAt |
| **Feedback** | A learner's rating/review of a course | learner, course, rating (1-5), comment |
| **Category** *(bonus)* | Catalog classification of courses | name (unique), slug, description |

## 3. Business rules

**Catalog**
- BR-01: Only courses with status `published` are visible in the public catalog.
- BR-02: A course belongs to exactly one trainer and one category.
- BR-03: A course has a level among `beginner`, `intermediate`, `advanced`.
- BR-04: `publishedAt` is set when a course transitions to `published`.

**Course structure**
- BR-05: A module belongs to exactly one course; modules are ordered by a unique `order` within the course.
- BR-06: A resource belongs to exactly one module; resources are ordered within the module.
- BR-07: A resource has a type among `video`, `article`, `pdf`, `link` and a valid URL.
- BR-08: Deleting a course deletes its modules and their resources (composition).

**Enrollment & progress**
- BR-09: Only a learner can enroll, and only in a published course.
- BR-10: A learner can have at most one active enrollment per course.
- BR-11: Progress can only be recorded for resources of a course the learner is enrolled in.
- BR-12: An enrollment becomes `completed` when all resources are completed and all quizzes are passed.

**Quizzes & feedback**
- BR-13: A quiz attempt is passed when `score >= passingScore`.
- BR-14: Only an enrolled learner can attempt a quiz of the course.
- BR-15: A learner can leave a single feedback per course, with a rating between 1 and 5.

**Users & roles**
- BR-16: Email addresses are unique.
- BR-17: A trainer can only manage their own courses; an admin can manage every course and user.
- BR-18: A deactivated user cannot log in.

## 4. Roles

| Role | Description | Main permissions |
| ---- | ----------- | ---------------- |
| **Visitor** | Anonymous user | Browse/search/filter the catalog, view course details and syllabus, register |
| **Learner** | Registered student | Visitor permissions + enroll, consume resources, track progress, take quizzes, leave feedback |
| **Trainer** | Course author | Create/update/publish/archive own courses, manage modules, resources and quizzes, view learners' progress and feedback |
| **Admin** | Platform administrator | Manage users and roles, moderate any course and feedback, manage categories, view statistics |

## 5. Backlog

Priority uses MoSCoW (**M**ust, **S**hould, **C**ould). The phase column indicates in which phase the item is delivered.

### Epic E1 - Course catalog

| ID | User story | Priority | Phase |
| -- | ---------- | -------- | ----- |
| US-01 | As a visitor, I want to list all published courses so that I can discover the training offer. | M | 1 |
| US-02 | As a visitor, I want to filter courses by category, level and keyword so that I find relevant courses. | M | 1 |
| US-03 | As a visitor, I want to sort courses by creation or publication date so that I see the newest first. | S | 1 |
| US-04 | As a visitor, I want to view a course's details so that I can decide whether to enroll. | M | 1 |
| US-05 | As a visitor, I want to see the modules of a course and their resources so that I know the syllabus. | M | 1 |
| US-06 | As a visitor, I want the catalog to be paginated so that it stays fast and readable. | C | 1 (bonus) |

### Epic E2 - Authentication & accounts

| ID | User story | Priority | Phase |
| -- | ---------- | -------- | ----- |
| US-07 | As a visitor, I want to register so that I can enroll in courses. | M | 2 |
| US-08 | As a user, I want to log in and log out so that I can access my space securely. | M | 2 |
| US-09 | As an admin, I want to manage users and their roles so that I control platform access. | S | 2 |

### Epic E3 - Course management (trainer)

| ID | User story | Priority | Phase |
| -- | ---------- | -------- | ----- |
| US-10 | As a trainer, I want to create, update and delete my courses. | M | 2 |
| US-11 | As a trainer, I want to add, reorder and remove modules and resources. | M | 2 |
| US-12 | As a trainer, I want to publish or archive a course so that I control its visibility. | M | 2 |

### Epic E4 - Learning journey

| ID | User story | Priority | Phase |
| -- | ---------- | -------- | ----- |
| US-13 | As a learner, I want to enroll in a published course. | M | 2 |
| US-14 | As a learner, I want to mark resources as completed and see my progress percentage. | M | 3 |
| US-15 | As a trainer, I want to see the progress of the learners enrolled in my courses. | S | 3 |

### Epic E5 - Evaluation & feedback

| ID | User story | Priority | Phase |
| -- | ---------- | -------- | ----- |
| US-16 | As a trainer, I want to create a quiz for a module. | S | 3 |
| US-17 | As a learner, I want to take a quiz and get my score immediately. | S | 3 |
| US-18 | As a learner, I want to rate and review a course I followed. | C | 3 |
| US-19 | As an admin, I want to moderate feedback. | C | 3 |

### Technical tasks (Phase 1)

| ID | Task | Related |
| -- | ---- | ------- |
| TT-01 | Initialize Node.js/Express project with modular structure (routes, controllers, models, middlewares, config) | - |
| TT-02 | Provide a `docker-compose.yml` for a local MongoDB instance and a `.env.example` | - |
| TT-03 | Write README (setup, run, scripts, git workflow) | - |
| TT-04 | Produce UML design: class, use case and sequence diagrams | - |
| TT-05 | Configure Mongoose connection | US-01..05 |
| TT-06 | Implement `Course`, `Module`, `Resource` (and `Category`) models with validations and relations | US-01..05 |
| TT-07 | Write a realistic seed script with web development courses + `db:reset` script | US-01..05 |
| TT-08 | Implement `notFound` and centralized `errorHandler` middlewares with consistent JSON errors | all |
| TT-09 | Implement read-only catalog routes with filtering, sorting and pagination | US-01..06 |
| TT-10 | Document the API with Swagger / OpenAPI | US-01..06 |
| TT-11 | Write automated tests for the catalog routes | US-01..06 |

## 6. Definition of done

- Code merged into `main` through a reviewed pull request from a feature branch.
- Endpoints documented in Swagger and covered by automated tests.
- No secrets committed; README up to date.
