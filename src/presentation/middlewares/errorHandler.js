function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    let statusCode = 500;

    if (err.message.includes('Invalid')) statusCode = 400;
    if (err.message.includes('not found')) statusCode = 404;
    if (err.message.includes('exists')) statusCode = 409;

    res.status(statusCode).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorHandler;
