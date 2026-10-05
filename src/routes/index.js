const { Router } = require('express');
const courseRoutes = require('./courseRoutes');
const moduleRoutes = require('./moduleRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
