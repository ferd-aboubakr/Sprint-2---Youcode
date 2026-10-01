const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

const categories = [
  { name: 'Frontend', description: 'HTML, CSS, JavaScript and modern UI frameworks.' },
  { name: 'Backend', description: 'Server-side development, APIs and architecture.' },
  { name: 'Databases', description: 'Relational and NoSQL data modelling and querying.' },
  { name: 'DevOps', description: 'Containers, CI/CD and deployment.' },
];

const courses = [
  {
    title: 'HTML & CSS Fundamentals',
    description:
      'Build accessible, responsive web pages from scratch with semantic HTML5 and modern CSS (Flexbox, Grid).',
    category: 'Frontend',
    level: 'beginner',
    tags: ['html', 'css', 'responsive', 'accessibility'],
    durationHours: 12,
    trainer: { name: 'Sara El Amrani', email: 'sara.elamrani@lms.dev' },
    status: 'published',
    publishedAt: '2026-01-15T09:00:00Z',
    modules: [
      {
        title: 'Semantic HTML5',
        description: 'Document structure, semantic tags and forms.',
        resources: [
          { title: 'HTML document structure', type: 'video', url: yt('UB1O30fR-EE'), durationMinutes: 18 },
          { title: 'MDN - HTML elements reference', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', durationMinutes: 25 },
          { title: 'Accessible forms checklist', type: 'pdf', url: 'https://www.w3.org/WAI/tutorials/forms/', durationMinutes: 15 },
        ],
      },
      {
        title: 'CSS Layouts with Flexbox and Grid',
        description: 'Position elements and build complex layouts.',
        resources: [
          { title: 'Flexbox in 20 minutes', type: 'video', url: yt('JJSoEo8JSnc'), durationMinutes: 20 },
          { title: 'A complete guide to CSS Grid', type: 'article', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', durationMinutes: 30 },
        ],
      },
      {
        title: 'Responsive Design',
        description: 'Media queries, fluid units and mobile-first.',
        resources: [
          { title: 'Mobile-first responsive design', type: 'video', url: yt('srvUrASNj0s'), durationMinutes: 22 },
          { title: 'web.dev - Learn Responsive Design', type: 'link', url: 'https://web.dev/learn/design', durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    title: 'Modern JavaScript (ES2023)',
    description:
      'Master the JavaScript language: types, functions, closures, modules, promises and async/await.',
    category: 'Frontend',
    level: 'beginner',
    tags: ['javascript', 'es6', 'async'],
    durationHours: 20,
    trainer: { name: 'Youssef Benali', email: 'youssef.benali@lms.dev' },
    status: 'published',
    publishedAt: '2026-02-03T09:00:00Z',
    modules: [
      {
        title: 'Language Basics',
        description: 'Variables, types, operators and control flow.',
        resources: [
          { title: 'JavaScript crash course', type: 'video', url: yt('hdI2bqOjy3c'), durationMinutes: 45 },
          { title: 'javascript.info - The JavaScript language', type: 'link', url: 'https://javascript.info/first-steps', durationMinutes: 60 },
        ],
      },
      {
        title: 'Functions and Closures',
        description: 'Scope, closures, arrow functions and this.',
        resources: [
          { title: 'Closures explained', type: 'video', url: yt('3a0I8ICR1Vg'), durationMinutes: 15 },
          { title: 'MDN - Closures', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', durationMinutes: 20 },
        ],
      },
      {
        title: 'Asynchronous JavaScript',
        description: 'Event loop, promises and async/await.',
        resources: [
          { title: 'The event loop', type: 'video', url: yt('8aGhZQkoFbQ'), durationMinutes: 26 },
          { title: 'Async/await guide', type: 'article', url: 'https://javascript.info/async-await', durationMinutes: 20 },
          { title: 'Promises cheat sheet', type: 'pdf', url: 'https://cdn.lms.dev/resources/promises-cheatsheet.pdf', durationMinutes: 10 },
        ],
      },
    ],
  },
  {
    title: 'React from Zero to Hero',
    description:
      'Build component-based single page applications with React, hooks, routing and state management.',
    category: 'Frontend',
    level: 'intermediate',
    tags: ['react', 'hooks', 'spa'],
    durationHours: 24,
    trainer: { name: 'Sara El Amrani', email: 'sara.elamrani@lms.dev' },
    status: 'published',
    publishedAt: '2026-04-10T09:00:00Z',
    modules: [
      {
        title: 'Components and JSX',
        description: 'Thinking in components, props and JSX.',
        resources: [
          { title: 'React official tutorial', type: 'link', url: 'https://react.dev/learn', durationMinutes: 60 },
          { title: 'JSX in depth', type: 'video', url: yt('7fPXI_MnBOY'), durationMinutes: 18 },
        ],
      },
      {
        title: 'Hooks',
        description: 'useState, useEffect and custom hooks.',
        resources: [
          { title: 'React hooks course', type: 'video', url: yt('TNhaISOUy6Q'), durationMinutes: 35 },
          { title: 'Rules of hooks', type: 'article', url: 'https://react.dev/reference/rules/rules-of-hooks', durationMinutes: 10 },
        ],
      },
    ],
  },
  {
    title: 'Node.js & Express REST APIs',
    description:
      'Design and build RESTful APIs with Node.js and Express: routing, middlewares, validation and error handling.',
    category: 'Backend',
    level: 'intermediate',
    tags: ['nodejs', 'express', 'rest', 'api'],
    durationHours: 18,
    trainer: { name: 'Karim Ouazzani', email: 'karim.ouazzani@lms.dev' },
    status: 'published',
    publishedAt: '2026-03-01T09:00:00Z',
    modules: [
      {
        title: 'Node.js Runtime',
        description: 'Modules, npm and the event loop.',
        resources: [
          { title: 'Node.js crash course', type: 'video', url: yt('fBNz5xF-Kx4'), durationMinutes: 90 },
          { title: 'Node.js docs - Introduction', type: 'link', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', durationMinutes: 20 },
        ],
      },
      {
        title: 'Express Routing and Middlewares',
        description: 'Routers, middlewares and the request lifecycle.',
        resources: [
          { title: 'Express routing guide', type: 'article', url: 'https://expressjs.com/en/guide/routing.html', durationMinutes: 20 },
          { title: 'Writing middlewares', type: 'article', url: 'https://expressjs.com/en/guide/writing-middleware.html', durationMinutes: 15 },
        ],
      },
      {
        title: 'Error Handling and Validation',
        description: 'Centralized error handler and consistent JSON errors.',
        resources: [
          { title: 'Express error handling', type: 'article', url: 'https://expressjs.com/en/guide/error-handling.html', durationMinutes: 15 },
          { title: 'HTTP status codes cheat sheet', type: 'pdf', url: 'https://cdn.lms.dev/resources/http-status-codes.pdf', durationMinutes: 5 },
        ],
      },
    ],
  },
  {
    title: 'Clean Architecture for Node.js',
    description:
      'Structure large Node.js back-ends with layered architecture, dependency injection and automated tests.',
    category: 'Backend',
    level: 'advanced',
    tags: ['nodejs', 'architecture', 'testing'],
    durationHours: 15,
    trainer: { name: 'Karim Ouazzani', email: 'karim.ouazzani@lms.dev' },
    status: 'published',
    publishedAt: '2026-06-20T09:00:00Z',
    modules: [
      {
        title: 'Layered Architecture',
        description: 'Controllers, services and repositories.',
        resources: [
          { title: 'Clean architecture explained', type: 'video', url: yt('CnailTcJV_U'), durationMinutes: 30 },
          { title: 'The clean architecture', type: 'article', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', durationMinutes: 15 },
        ],
      },
      {
        title: 'Testing APIs with Jest and Supertest',
        description: 'Unit and integration testing.',
        resources: [
          { title: 'Jest getting started', type: 'link', url: 'https://jestjs.io/docs/getting-started', durationMinutes: 20 },
          { title: 'API integration tests', type: 'video', url: yt('FKnzS_icp20'), durationMinutes: 28 },
        ],
      },
    ],
  },
  {
    title: 'MongoDB & Mongoose Essentials',
    description:
      'Model data for MongoDB, write queries and aggregations, and use Mongoose schemas, validation and relations.',
    category: 'Databases',
    level: 'beginner',
    tags: ['mongodb', 'mongoose', 'nosql'],
    durationHours: 10,
    trainer: { name: 'Imane Tazi', email: 'imane.tazi@lms.dev' },
    status: 'published',
    publishedAt: '2026-05-05T09:00:00Z',
    modules: [
      {
        title: 'Document Model',
        description: 'Documents, collections and data modelling.',
        resources: [
          { title: 'MongoDB in 30 minutes', type: 'video', url: yt('ofme2o29ngU'), durationMinutes: 30 },
          { title: 'Data modelling introduction', type: 'article', url: 'https://www.mongodb.com/docs/manual/data-modeling/', durationMinutes: 25 },
        ],
      },
      {
        title: 'Mongoose Schemas and Relations',
        description: 'Schemas, validation, references and populate.',
        resources: [
          { title: 'Mongoose guide', type: 'link', url: 'https://mongoosejs.com/docs/guide.html', durationMinutes: 30 },
          { title: 'Populate in practice', type: 'article', url: 'https://mongoosejs.com/docs/populate.html', durationMinutes: 15 },
        ],
      },
    ],
  },
  {
    title: 'SQL & PostgreSQL Advanced Queries',
    description: 'Window functions, CTEs, indexing strategies and query optimisation with PostgreSQL.',
    category: 'Databases',
    level: 'advanced',
    tags: ['sql', 'postgresql', 'performance'],
    durationHours: 14,
    trainer: { name: 'Imane Tazi', email: 'imane.tazi@lms.dev' },
    status: 'draft',
    modules: [
      {
        title: 'Window Functions',
        description: 'OVER, PARTITION BY and ranking.',
        resources: [
          { title: 'PostgreSQL window functions', type: 'article', url: 'https://www.postgresql.org/docs/current/tutorial-window.html', durationMinutes: 20 },
        ],
      },
    ],
  },
  {
    title: 'Docker for Web Developers',
    description: 'Containerize web applications with Dockerfiles and orchestrate local stacks with Docker Compose.',
    category: 'DevOps',
    level: 'intermediate',
    tags: ['docker', 'docker-compose', 'containers'],
    durationHours: 8,
    trainer: { name: 'Youssef Benali', email: 'youssef.benali@lms.dev' },
    status: 'published',
    publishedAt: '2026-07-12T09:00:00Z',
    modules: [
      {
        title: 'Containers and Images',
        description: 'Images, containers, layers and Dockerfiles.',
        resources: [
          { title: 'Docker in 100 seconds', type: 'video', url: yt('Gjnup-PuquQ'), durationMinutes: 2 },
          { title: 'Dockerfile reference', type: 'link', url: 'https://docs.docker.com/reference/dockerfile/', durationMinutes: 30 },
        ],
      },
      {
        title: 'Docker Compose',
        description: 'Multi-container applications for local development.',
        resources: [
          { title: 'Compose quickstart', type: 'article', url: 'https://docs.docker.com/compose/gettingstarted/', durationMinutes: 20 },
          { title: 'Compose cheat sheet', type: 'pdf', url: 'https://cdn.lms.dev/resources/compose-cheatsheet.pdf', durationMinutes: 5 },
        ],
      },
    ],
  },
  {
    title: 'jQuery Basics',
    description: 'DOM manipulation and AJAX with jQuery (legacy course kept for archive purposes).',
    category: 'Frontend',
    level: 'beginner',
    tags: ['jquery', 'legacy'],
    durationHours: 6,
    trainer: { name: 'Sara El Amrani', email: 'sara.elamrani@lms.dev' },
    status: 'archived',
    publishedAt: '2024-09-01T09:00:00Z',
    modules: [
      {
        title: 'Selectors and Events',
        description: 'Selecting elements and handling events.',
        resources: [
          { title: 'jQuery API documentation', type: 'link', url: 'https://api.jquery.com/', durationMinutes: 20 },
        ],
      },
    ],
  },
];

module.exports = { categories, courses };
