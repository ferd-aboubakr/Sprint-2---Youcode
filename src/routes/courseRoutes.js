const { Router } = require('express');
const { listCourses, getCourse, listCourseModules } = require('../controllers/courseController');
const validateObjectId = require('../middlewares/validateObjectId');

const router = Router();

router.get('/', listCourses);
router.get('/:id', validateObjectId('id'), getCourse);
router.get('/:id/modules', validateObjectId('id'), listCourseModules);

module.exports = router;
