const RateLimiter = require('limiter').RateLimiter;

// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds
const rateLimit = {
    rate: 5,
    every: 1000,
    unit: 'milliseconds'
};
const {rate, every, unit} = rateLimit;
const limiter = new RateLimiter(rate, every, true);

module.exports = function (req, res, next) {
    // Throttle requests
    limiter.removeTokens(1, function(error, remainingRequests) {
        // err will only be set if we request more than the maximum number of
        // requests we set in the constructor
        const remainingRequestsFloor = Math.floor(remainingRequests);
        const depletionErrorMessage = `Rate ${rate} Limit ${every} ${unit} exeeded`;
        if (remainingRequestsFloor <= 0) return res.status(400).send(depletionErrorMessage + error);
        // remainingRequests tells us how many additional requests could be sent
        // right this moment  
        next();
    });
}