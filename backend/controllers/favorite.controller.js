
const favoriteService = require('../services/favorite.service');

async function getMyFavorites(req, res) {
  try {
    const userId = req.user.id;
    const favorites = await favoriteService.getUserFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching favorites.' });
  }
}

async function addFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { opportunityId } = req.params;

    const favorite = await favoriteService.addFavorite(userId, opportunityId);
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === '23505') { // unique_violation (already in favorites)
      return res.status(409).json({ message: 'This opportunity is already in your favorites.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while adding favorite.' });
  }
}

async function removeFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { opportunityId } = req.params;

    const removed = await favoriteService.removeFavorite(userId, opportunityId);

    if (!removed) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    res.status(200).json({ message: 'Favorite removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while removing favorite.' });
  }
}

module.exports = { getMyFavorites, addFavorite, removeFavorite };