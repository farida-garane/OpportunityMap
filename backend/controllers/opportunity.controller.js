
const opportunityService = require('../services/opportunity.service');

async function getAll(req, res) {
  try {
    const { type, field, city } = req.query; 
    const opportunities = await opportunityService.getAllOpportunities({ type, field, city });
    res.status(200).json(opportunities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching opportunities.' });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const opportunity = await opportunityService.getOpportunityById(id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    res.status(200).json(opportunity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching opportunity.' });
  }
}

async function create(req, res) {
  try {
    const userId = req.user.id; // set by authMiddleware
    const { title, type, description, field, city, latitude, longitude, deadline, link } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required.' });
    }

    const newOpportunity = await opportunityService.createOpportunity({
      title, type, description, field, city, latitude, longitude, deadline, link, created_by: userId,
    });

    res.status(201).json(newOpportunity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating opportunity.' });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updated = await opportunityService.updateOpportunity(id, userId, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Opportunity not found or not authorized.' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating opportunity.' });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await opportunityService.deleteOpportunity(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Opportunity not found or not authorized.' });
    }

    res.status(200).json({ message: 'Opportunity deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting opportunity.' });
  }
}

module.exports = { getAll, getById, create, update, remove };