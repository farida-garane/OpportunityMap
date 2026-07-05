
const dashboardService = require('../services/dashboard.service');

async function getSummary(req, res) {
  try {
    const userId = req.user.id;
    const summary = await dashboardService.getUserSummary(userId);
    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching dashboard summary.' });
  }
}

module.exports = { getSummary };