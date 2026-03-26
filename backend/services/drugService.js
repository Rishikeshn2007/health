const axios = require('axios');

const fetchDrugId = async (drugName) => {
    try {
        // Calling the NIH RxNorm API
        const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json`, {
            params: { name: drugName, search: 1 }
        });

        const rxnormIds = response.data.idGroup.rxnormId;

        if (!rxnormIds || rxnormIds.length === 0) {
            return null;
        }

        // Return the first matching ID (RxCUI)
        return rxnormIds[0];
    } catch (error) {
        throw new Error('Medical Database Unavailable');
    }
};

module.exports = { fetchDrugId };