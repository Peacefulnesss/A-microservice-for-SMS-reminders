const Router = require('express')
const router = new Router();
const applicationController = require('../Controllers/applicationsController')

router.get('/', applicationController.getAllApplications)
router.get('/:id', applicationController.getApplicationById)
router.get('/dates/:id', applicationController.getBookedDates)
router.post('/', applicationController.createApplication)
router.put('/:id', applicationController.updateApplication)
router.delete('/:id', applicationController.deleteApplication)

module.exports = router;