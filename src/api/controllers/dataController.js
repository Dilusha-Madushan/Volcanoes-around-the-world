const volcanoService = require('../services/volcanoService');

const getAllVolcanoes = async (req, res) => {
    try {
        const { country, populatedWithin } = req.query;
        const validPopulatedWithinValues = ['5km', '10km', '30km', '100km'];

        if (!country) {
            return res.status(400).json({ error: true, message: "Country is a required query parameter." });
        }

        if (Object.keys(req.query).some(key => !['country', 'populatedWithin'].includes(key))) {
            return res.status(400).json({ error: true, message: "Invalid query parameters. Only 'country' and 'populatedWithin' are permitted." });
        }

        if (populatedWithin && !validPopulatedWithinValues.includes(populatedWithin)) {
            return res.status(400).json({ error: true, message: "Invalid value for populatedWithin. Only: 5km, 10km, 30km, 100km are permitted." });
        }

        const volcanoes = await volcanoService.getAllVolcanoes(country, populatedWithin);
        res.status(200).json(volcanoes);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};



const getVolcanoById = async (req, res) => {
    try {
        const volcano = await volcanoService.getVolcanoById(req.params.id, req.isAuthenticated);
        if (!volcano) {
            return res.status(404).json({ error: true, message: `Volcano with ID: ${req.params.id} not found.` });
        }
        res.status(200).json(volcano);
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const getCountries = async (req, res) => {
    try {
        const countries = await volcanoService.getCountries(); // This method needs to be implemented in volcanoService
        res.status(200).json(countries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getNearbyVolcanoesById = async (req, res) => {
    try {
        const { id } = req.params;
        const referenceVolcano = await volcanoService.getVolcanoById(req.params.id, req.isAuthenticated);

        if (!referenceVolcano) {
            return res.status(404).json({ error: true, message: 'Volcano not found' });
        }

        const { latitude, longitude } = referenceVolcano;
        let { distance } = req.query;

        distance = distance || '5';

        const volcanoes = await volcanoService.findNearbyVolcanoes(latitude, longitude, distance, req.isAuthenticated);
        res.json(volcanoes);
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};

module.exports = {
    getCountries,
    getAllVolcanoes,
    getVolcanoById,
    getNearbyVolcanoesById
};
