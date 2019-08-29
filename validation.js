// Validation
const Joi = require('@hapi/joi');

// Register Validation 
const registerValidation = (data) => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    };
    return Joi.validate(data, schema);
};

// Login Validation 
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    };
    return Joi.validate(data, schema);
};

// Amazon Connect Throughput Validation
const amazonConnectThroughputValidation = (data) => {
    const schema = {
        voiceThroughput: Joi.number().max(500).required(),
        videoThroughput: Joi.number().required(),
        screenShareThroughput: Joi.number().max(500).required(),
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.amazonConnectThroughputValidation = amazonConnectThroughputValidation;