const Router = require('express')
const router = new Router();
const reviewController = require('../Controllers/reviewsController')

router.get('/reviews', reviewController.getAllReviews)
router.get('/review/:id', reviewController.getReviewById)
router.post('/review', reviewController.createReview)
router.put('/review/:id', reviewController.updateReview)
router.delete('/review/:id', reviewController.deleteReview)

module.exports = router;