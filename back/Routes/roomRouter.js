const Router = require('express')
const router = new Router();
const roomController = require('../Controllers/roomController')

router.get('/', roomController.getAllRooms)
router.get('/:id', roomController.getRoomById)
router.post('/', roomController.createRoom)
router.put('/:id', roomController.updateRoom)
router.delete('/:id', roomController.deleteRoom)

module.exports = router;