const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/', isAdmin, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', isAdmin, userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;