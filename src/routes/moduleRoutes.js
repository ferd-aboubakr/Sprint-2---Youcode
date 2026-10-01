const { Router } = require('express');
const { listModuleResources } = require('../controllers/moduleController');
const validateObjectId = require('../middlewares/validateObjectId');

const router = Router();

router.get('/:id/resources', validateObjectId('id'), listModuleResources);

module.exports = router;
