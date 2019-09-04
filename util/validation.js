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

// Returns CIDR validated address
const networkScopeValidation = (data) => {
    const schema = {
        ipV4cidr: Joi.string().max(18).required(),
    };
    return Joi.validate(data, schema);
};

// Returns Cisco option 43 validarted information
const ciscoOption43Validation = (data) => {
    const schema = {
        ipV4: Joi.array().max(4).required(),
    };
    return Joi.validate(data, schema);
};

const ciscoDecodeOption43Validation = (data) => {
    const schema = {
        option43: Joi.string().max(36).required(),
    };
    return Joi.validate(data, schema);
};

const ipFromStringValidation = (data) => {
    const schema = {
        string: Joi.string().max(40000).required(),
        options: Joi.object().required(),
    };
    return Joi.validate(data, schema);
};

const macFromStringValidation = (data) => {
    const schema = {
        string: Joi.string().max(40000).required(),
        options: Joi.object().required(),
    };
    return Joi.validate(data, schema);
};

const textRecognitionValidation = (data) => {
    // Cap in bit size
    const dataSizeCap = (10 * (Math.pow(10,7)));
    const postErrorMessage = {error: "Post should not Contain Body: Expected Image Form Data"};
    if (data > dataSizeCap ) {
        return postErrorMessage;
    } else {
        return data;
    } 
    
    
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.amazonConnectThroughputValidation = amazonConnectThroughputValidation;
module.exports.networkScopeValidation = networkScopeValidation;
module.exports.ciscoOption43Validation = ciscoOption43Validation;
module.exports.ciscoDecodeOption43Validation = ciscoDecodeOption43Validation;
module.exports.ipFromStringValidation = ipFromStringValidation;
module.exports.textRecognitionValidation = textRecognitionValidation;
module.exports.macFromStringValidation = macFromStringValidation;
