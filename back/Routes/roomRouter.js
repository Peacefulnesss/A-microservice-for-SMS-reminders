const Router = require('express')
const router = new Router();
const roomController = require('../Controllers/roomController')

router.get('/rooms', roomController.getAllRooms)
router.get('/room/:id', roomController.getRoomById)
router.post('/room', roomController.createRoom)
router.put('/room/:id', roomController.updateRoom)
router.delete('/room/:id', roomController.deleteRoom)

module.exports = router;