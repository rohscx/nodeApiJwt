const router = require('express').Router();
const verify = require('./verifyToken');
const amznConnectReqirements =  require('nodeUtilz').amznConnectReqirements;
const {amazonConnectThroughputValidation} = require('../validation');

router.get('/',verify ,(req, res) => {
    res.send(req.user);
});

router.post('/amznConnectThroughputCalc' ,verify ,async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE ADD A pass it into the function
    const {error} = amazonConnectThroughputValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {voiceThroughput, videoThroughput, screenShareThroughput} = req.body;
    const amazonConnectThroughputcalc = await amznConnectReqirements(voiceThroughput,videoThroughput,screenShareThroughput);
    res.send(amazonConnectThroughputcalc);
});

module.exports = router;