const router = require('express').Router();
const verify = require('../middleware/verifyToken');
const rateLimiter = require('../middleware/rateLimiter');
const amznConnectReqirements =  require('nodeUtilz').amznConnectReqirements;
const networkScope =  require('nodeUtilz').networkScope;
const ciscoOption43 =  require('nodeUtilz').ciscoOption43;
const ciscoDecodeOption43 =  require('nodeUtilz').ciscoDecodeOption43;
const ipFromString =  require('nodeUtilz').ipFromString;
const {
    amazonConnectThroughputValidation,
    networkScopeValidation,
    ciscoOption43Validation,
    ciscoDecodeOption43Validation,
    ipFromStringValidation,
} = require('../util/validation');


router.get('/',verify, rateLimiter, (req, res) => {
    res.send(req.user);
});

router.post('/amznConnectThroughputCalc' ,verify, rateLimiter, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE ADD A pass it into the function
    const {error} = amazonConnectThroughputValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {voiceThroughput, videoThroughput, screenShareThroughput} = req.body;
    const amazonConnectThroughputcalc = await amznConnectReqirements(voiceThroughput,videoThroughput,screenShareThroughput);
    res.send(amazonConnectThroughputcalc);
});

router.post('/networkScope' ,verify, rateLimiter, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE ADD A pass it into the function
    const {error} = networkScopeValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {ipV4cidr} = req.body;
    const cidr = await networkScope(ipV4cidr);
    const {ip, mask, network, hosts} = cidr.pop();
    const networkCidr = network + '/' +(ipV4cidr.split(new RegExp(/(?:(\/))/))[2]);
    const newObject = {
        ip,
        mask,
        network,
        hosts,
        cidrNetwork: networkCidr,
    }
    res.send(newObject);
})

router.post('/ciscoOption43' ,verify, rateLimiter, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE ADD A pass it into the function
    const {error} = ciscoOption43Validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {ipV4} = req.body;
    const option43 = await ciscoOption43(ipV4);
    res.send({option43});
})

router.post('/ciscoDecodeOption43' ,verify, rateLimiter, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE ADD A pass it into the function
    const {error} = ciscoDecodeOption43Validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {option43} = req.body;
    const option43Result = await ciscoDecodeOption43(option43);
    res.send(option43Result);
})

router.post('/ipv4FromString' ,verify, rateLimiter, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE ADD A pass it into the function
    const {error} = ipFromStringValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {string} = req.body;
    const ipv4FromString = ipFromString(string);
    res.send(ipv4FromString);
})
module.exports = router;