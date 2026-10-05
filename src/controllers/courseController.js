const { Category, Course, Module } = require('../models');
const { LEVELS } = require('../models/Course');
const HttpError = require('../utils/HttpError');
const escapeRegex = require('../utils/escapeRegex');
const isObjectId = require('../utils/isObjectId');

const SORT_FIELDS = ['createdAt', 'publishedAt'];
const DEFAULT_SORT = '-publishedAt';
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parsePositiveInt(value, name, fallback) {
  if (value === undefined || value === '') return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw HttpError.badRequest(`${name} must be a positive integer`);
  }
  return number;
}

function singleValue(value, name) {
  if (Array.isArray(value) || (value !== undefined && typeof value !== 'string')) {
    throw HttpError.badRequest(`${name} must be a single value`);
  }
  return value === undefined ? undefined : value.trim();
}

function parseSort(value) {
  const raw = singleValue(value, 'sort') || DEFAULT_SORT;
  const desc = raw.startsWith('-');
  const field = desc ? raw.slice(1) : raw;
  if (!SORT_FIELDS.includes(field)) {
    throw HttpError.badRequest(
      `sort must be one of: ${SORT_FIELDS.flatMap((f) => [f, `-${f}`]).join(', ')}`,
    );
  }
  return { [field]: desc ? -1 : 1, _id: 1 };
}

async function resolveCategoryId(value) {
  const query = isObjectId(value)
    ? { $or: [{ _id: value }, { slug: value.toLowerCase() }] }
    : { slug: value.toLowerCase() };
  const category = await Category.findOne(query).select('_id').lean();
  return category ? category._id : null;
}

async function findPublishedCourse(id) {
  const course = await Course.findOne({ _id: id, status: 'published' })
    .populate('category', 'name slug')
    .lean();
  if (!course) throw HttpError.notFound(`Course not found: ${id}`);
  return course;
}

async function listCourses(req, res) {
  const category = singleValue(req.query.category, 'category');
  const level = singleValue(req.query.level, 'level');
  const keyword = singleValue(req.query.keyword, 'keyword');
  const sort = parseSort(req.query.sort);
  const page = parsePositiveInt(singleValue(req.query.page, 'page'), 'page', 1);
  const limit = Math.min(
    parsePositiveInt(singleValue(req.query.limit, 'limit'), 'limit', DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  const filter = { status: 'published' };

  if (level) {
    if (!LEVELS.includes(level.toLowerCase())) {
      throw HttpError.badRequest(`level must be one of: ${LEVELS.join(', ')}`);
    }
    filter.level = level.toLowerCase();
  }

  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), 'i');
    filter.$or = [{ title: regex }, { description: regex }, { tags: regex }];
  }

  if (category) {
    const categoryId = await resolveCategoryId(category);
    if (!categoryId) {
      return res.json({ data: [], meta: { total: 0, page, limit, totalPages: 0 } });
    }
    filter.category = categoryId;
  }

  const [total, courses] = await Promise.all([
    Course.countDocuments(filter),
    Course.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return res.json({
    data: courses,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

async function getCourse(req, res) {
  const course = await findPublishedCourse(req.params.id);
  res.json({ data: course });
}

async function listCourseModules(req, res) {
  const course = await findPublishedCourse(req.params.id);
  const modules = await Module.find({ course: course._id }).sort({ order: 1 }).lean();
  res.json({ data: modules, meta: { total: modules.length } });
}

module.exports = { listCourses, getCourse, listCourseModules };
