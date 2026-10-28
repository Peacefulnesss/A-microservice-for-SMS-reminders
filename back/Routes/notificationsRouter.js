const NotificationController = require("../Controllers/notificationsController")
const express = require("express")
const notificationRouter = express.Router()

notificationRouter.post('/', NotificationController.listNotifications);
notificationRouter.post('/:id/read', NotificationController.markRead);

module.exports = notificationRouter