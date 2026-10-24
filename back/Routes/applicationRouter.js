const Router = require('express')
const router = new Router();
const applicationController = require('../Controllers/applicationsController')

router.get('/applications', applicationController.getAllApplications)
router.get('/application/:id', applicationController.getApplicationById)
router.post('/application', applicationController.createApplication)
router.put('/application/:id', applicationController.updateApplication)
router.delete('/application/:id', applicationController.deleteApplication)

module.exports = router;