const notificationService = require('../services/notification.service');

async function getMyNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching notifications.' });
  }
}

async function markAsRead(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updated = await notificationService.markNotificationAsRead(id, userId);

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating notification.' });
  }
}

module.exports = { getMyNotifications, markAsRead };