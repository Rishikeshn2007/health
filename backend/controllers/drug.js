const drugService = require('../services/drugService');

const handleDrugSearch = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ success: false, message: "Drug name is required" });
        }

        // INTEGRATION: Calling the service layer
        const rxcui = await drugService.fetchDrugId(name);

        if (!rxcui) {
            return res.status(404).json({ success: false, message: "Medication not found" });
        }

        // Returning the standardized ID to the frontend
        return res.status(200).json({
            success: true,
            data: {
                inputName: name,
                rxnormId: rxcui
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { handleDrugSearch };