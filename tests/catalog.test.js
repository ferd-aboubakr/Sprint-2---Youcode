const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { Course, Module } = require('../src/models');
const { clearCatalog, seedCatalog } = require('../src/seed/seed');
const data = require('../src/seed/data');
const { startDatabase, stopDatabase } = require('./setup');

const publishedCourses = data.courses.filter((c) => c.status === 'published');
const UNKNOWN_ID = '0123456789abcdef01234567';

const timestamps = (items, field) => items.map((item) => new Date(item[field]).getTime());

before(async () => {
  await startDatabase();
  await Promise.all([Course.syncIndexes(), Module.syncIndexes()]);
  await clearCatalog();
  await seedCatalog();
});

after(stopDatabase);

describe('GET /api/courses', () => {
  it('lists only published courses sorted by publication date (newest first)', async () => {
    const res = await request(app).get('/api/courses?limit=50').expect(200);

    assert.deepEqual(res.body.meta, { total: publishedCourses.length, page: 1, limit: 50, totalPages: 1 });
    assert.equal(res.body.data.length, publishedCourses.length);
    assert.ok(res.body.data.every((c) => c.status === 'published'));
    assert.equal(typeof res.body.data[0].category.name, 'string');
    assert.equal(typeof res.body.data[0].category.slug, 'string');

    const dates = timestamps(res.body.data, 'publishedAt');
    assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
  });

  it('sorts by ascending publication date', async () => {
    const res = await request(app).get('/api/courses?sort=publishedAt&limit=50').expect(200);
    const dates = timestamps(res.body.data, 'publishedAt');
    assert.deepEqual(dates, [...dates].sort((a, b) => a - b));
  });

  it('sorts by descending creation date', async () => {
    const res = await request(app).get('/api/courses?sort=-createdAt&limit=50').expect(200);
    const dates = timestamps(res.body.data, 'createdAt');
    assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
  });

  it('filters by category slug and level', async () => {
    const res = await request(app).get('/api/courses?category=frontend&level=beginner').expect(200);
    const expected = publishedCourses.filter((c) => c.category === 'Frontend' && c.level === 'beginner');

    assert.equal(res.body.meta.total, expected.length);
    assert.deepEqual(res.body.data.map((c) => c.title).sort(), expected.map((c) => c.title).sort());
  });

  it('filters by category id', async () => {
    const all = await request(app).get('/api/courses?category=backend').expect(200);
    const categoryId = all.body.data[0].category._id;
    const res = await request(app).get(`/api/courses?category=${categoryId}`).expect(200);
    assert.equal(res.body.meta.total, all.body.meta.total);
  });

  it('filters by keyword (case-insensitive, title/description/tags)', async () => {
    const res = await request(app).get('/api/courses?keyword=DOCKER').expect(200);
    assert.deepEqual(res.body.data.map((c) => c.title), ['Docker for Web Developers']);
  });

  it('treats the keyword literally (regex characters are escaped)', async () => {
    const res = await request(app).get('/api/courses?keyword=.*').expect(200);
    assert.equal(res.body.meta.total, 0);
  });

  it('returns an empty list for an unknown category', async () => {
    const res = await request(app).get('/api/courses?category=unknown').expect(200);
    assert.deepEqual(res.body, { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
  });

  it('paginates results', async () => {
    const page1 = await request(app).get('/api/courses?limit=3&page=1').expect(200);
    const page3 = await request(app).get('/api/courses?limit=3&page=3').expect(200);

    assert.equal(page1.body.data.length, 3);
    assert.deepEqual(page1.body.meta, {
      total: publishedCourses.length,
      page: 1,
      limit: 3,
      totalPages: Math.ceil(publishedCourses.length / 3),
    });
    assert.equal(page3.body.data.length, publishedCourses.length - 6);
  });

  for (const [query, message] of [
    ['level=expert', 'level must be one of'],
    ['sort=title', 'sort must be one of'],
    ['page=0', 'page must be a positive integer'],
    ['limit=abc', 'limit must be a positive integer'],
    ['level=beginner&level=advanced', 'level must be a single value'],
  ]) {
    it(`rejects invalid query "${query}" with 400`, async () => {
      const res = await request(app).get(`/api/courses?${query}`).expect(400);
      assert.equal(res.body.error.status, 400);
      assert.match(res.body.error.message, new RegExp(message));
    });
  }
});

describe('GET /api/courses/:id', () => {
  it('returns a published course with its category', async () => {
    const course = await Course.findOne({ status: 'published' });
    const res = await request(app).get(`/api/courses/${course.id}`).expect(200);

    assert.equal(res.body.data._id, course.id);
    assert.equal(res.body.data.title, course.title);
    assert.equal(typeof res.body.data.category.slug, 'string');
  });

  it('returns 404 for a draft course', async () => {
    const draft = await Course.findOne({ status: 'draft' });
    const res = await request(app).get(`/api/courses/${draft.id}`).expect(404);
    assert.deepEqual(res.body.error, { status: 404, message: `Course not found: ${draft.id}` });
  });

  it('returns 404 for an unknown id', async () => {
    await request(app).get(`/api/courses/${UNKNOWN_ID}`).expect(404);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/api/courses/not-an-id').expect(400);
    assert.deepEqual(res.body.error, { status: 400, message: 'Invalid id: not-an-id' });
  });
});

describe('GET /api/courses/:id/modules', () => {
  it('lists the modules of a course sorted by order', async () => {
    const course = await Course.findOne({ title: 'HTML & CSS Fundamentals' });
    const res = await request(app).get(`/api/courses/${course.id}/modules`).expect(200);

    assert.equal(res.body.meta.total, 3);
    assert.deepEqual(res.body.data.map((m) => m.order), [1, 2, 3]);
    assert.ok(res.body.data.every((m) => m.course === course.id));
  });

  it('returns 404 for an archived course', async () => {
    const archived = await Course.findOne({ status: 'archived' });
    await request(app).get(`/api/courses/${archived.id}/modules`).expect(404);
  });
});

describe('GET /api/modules/:id/resources', () => {
  it('lists the resources of a module sorted by order', async () => {
    const course = await Course.findOne({ title: 'HTML & CSS Fundamentals' });
    const mod = await Module.findOne({ course: course._id, order: 1 });
    const res = await request(app).get(`/api/modules/${mod.id}/resources`).expect(200);

    assert.equal(res.body.meta.total, 3);
    assert.deepEqual(res.body.data.map((r) => r.order), [1, 2, 3]);
    assert.ok(res.body.data.every((r) => r.module === mod.id));
  });

  it('returns 404 when the module belongs to an unpublished course', async () => {
    const draft = await Course.findOne({ status: 'draft' });
    const mod = await Module.findOne({ course: draft._id });
    await request(app).get(`/api/modules/${mod.id}/resources`).expect(404);
  });

  it('returns 404 for an unknown module', async () => {
    const res = await request(app).get(`/api/modules/${UNKNOWN_ID}/resources`).expect(404);
    assert.equal(res.body.error.message, `Module not found: ${UNKNOWN_ID}`);
  });
});

describe('GET /api/categories', () => {
  it('lists categories sorted by name', async () => {
    const res = await request(app).get('/api/categories').expect(200);
    assert.deepEqual(res.body.data.map((c) => c.name), data.categories.map((c) => c.name).sort());
  });
});

describe('errors and documentation', () => {
  it('returns a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown').expect(404);
    assert.deepEqual(res.body, { error: { status: 404, message: 'Route not found: GET /api/unknown' } });
  });

  it('serves the OpenAPI document', async () => {
    const res = await request(app).get('/api-docs.json').expect(200);
    for (const path of ['/courses', '/courses/{id}', '/courses/{id}/modules', '/modules/{id}/resources']) {
      assert.ok(res.body.paths[path], `missing ${path}`);
    }
  });
});
