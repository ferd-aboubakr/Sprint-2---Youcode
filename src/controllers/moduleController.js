const { Course, Module, Resource } = require('../models');
const HttpError = require('../utils/HttpError');

async function listModuleResources(req, res) {
  const { id } = req.params;
  const mod = await Module.findById(id).lean();
  const isVisible =
    mod && (await Course.exists({ _id: mod.course, status: 'published' }));
  if (!isVisible) throw HttpError.notFound(`Module not found: ${id}`);

  const resources = await Resource.find({ module: mod._id }).sort({ order: 1 }).lean();
  res.json({ data: resources, meta: { total: resources.length } });
}

module.exports = { listModuleResources };
