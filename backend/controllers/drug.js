const { fetchDrugId } = require('../services/drugService');

async function handleDrugSearch(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      error: 'Drug name is required'
    });
  }

  try {
    const drugId = await fetchDrugId(name);

    if (!drugId) {
      return res.status(404).json({
        error: 'Drug not found'
      });
    }

    return res.status(200).json({
      name,
      drugId
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to search drug'
    });
  }
}

module.exports = { handleDrugSearch };
