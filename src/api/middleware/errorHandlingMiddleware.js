const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err); // Log error to the console for debugging
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

module.exports = errorHandler;
