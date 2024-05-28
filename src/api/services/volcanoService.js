const dataModel = require('../../models/dataModel');

const getAllVolcanoes = async (country, populatedWithin) => {
    try {
        return await dataModel.findAllVolcanoes(country, populatedWithin);
    } catch (error) {
        throw error;
    }
};

const getVolcanoById = async (id, isAuthenticated) => {
    try {
        let volcano;

        if (isAuthenticated) {
            volcano = await dataModel.findByIdWithPopulation(id);
        } else {
            volcano = await dataModel.findById(id);
        }
        return volcano;
    } catch (error) {
        throw error;
    }
};

const getCountries = async () => {
    try {
        const results = await dataModel.findAllCountries();
        const countries = results.map(item => item.country);
        return countries;
    } catch (error) {
        throw error;
    }
};

const findNearbyVolcanoes = async (latitude, longitude, distance, isAuthenticated) => {
    return await dataModel.findNearbyVolcanoes(latitude, longitude, distance, isAuthenticated);
};


module.exports = {
    getAllVolcanoes,
    getVolcanoById,
    getCountries,
    findNearbyVolcanoes
};
