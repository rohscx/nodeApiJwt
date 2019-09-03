const router = require('express').Router();
const verify = require('../middleware/verifyToken');
const rateLimiter = require('../middleware/rateLimiter');
const TesseractTask = require('../model/TesseractTask');
const amznConnectReqirements =  require('nodeUtilz').amznConnectReqirements;
const networkScope = require('nodeUtilz').networkScope;
const ciscoOption43 = require('nodeUtilz').ciscoOption43;
const ciscoDecodeOption43 = require('nodeUtilz').ciscoDecodeOption43;
const ipFromString = require('nodeUtilz').ipFromString;
const macFromString = require('nodeUtilz').macFromString;
const readFile = require('nodeUtilz').readFile;
const deleteFile = require('nodeUtilz').deleteFile;
const dirContents = require('nodeUtilz').dirContents;
const textRecognition = require('nodeUtilz').tesseractOcr;
const {
    amazonConnectThroughputValidation,
    networkScopeValidation,
    ciscoOption43Validation,
    ciscoDecodeOption43Validation,
    ipFromStringValidation,
    macFromStringValidation,
} = require('../util/validation');
const multer = require('multer');
const upload = multer({ 
    dest: 'uploads/' ,
    limits: { fileSize: (10 *(Math.pow(10,6))) },
})

router.get('/',verify, rateLimiter, (req, res) => {
    res.send(req.user);
});

router.get('/textRecognition/*',verify, rateLimiter, async (req, res) => {
    const splitUri = req.url.split('/');
    if (splitUri.length > 3) return res.status(404).send('ノಠ益ಠノ彡┻━┻  404 page')
    const result = await TesseractTask.findOne({ocrId: splitUri[2]})
    res.send(result);
});



router.post('/amznConnectThroughputCalc', rateLimiter, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const {error} = amazonConnectThroughputValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {voiceThroughput, videoThroughput, screenShareThroughput} = req.body;
    const amazonConnectThroughputcalc = await amznConnectReqirements(voiceThroughput,videoThroughput,screenShareThroughput);
    res.send(amazonConnectThroughputcalc);
});

router.post('/networkScope', rateLimiter, verify, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const {error} = networkScopeValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {ipV4cidr} = req.body;
    const cidr = await networkScope(ipV4cidr);
    const {ip, mask, network, hosts, subnets, range, prefix} = cidr.pop();
    // const networkCidr = network + '/' +(ipV4cidr.split(new RegExp(/(?:(\/))/))[2]); // not needed remove later
    const newObject = {
        ip,
        mask,
        network,
        hosts,
        subnets,
        range,
        prefix,
    }
    res.send(newObject);
})

router.post('/ciscoOption43', rateLimiter, verify, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const {error} = ciscoOption43Validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {ipV4} = req.body;
    const option43 = await ciscoOption43(ipV4);
    res.send({option43});
})

router.post('/ciscoDecodeOption43', rateLimiter, verify, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const {error} = ciscoDecodeOption43Validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {option43} = req.body;
    const option43Result = await ciscoDecodeOption43(option43);
    res.send(option43Result);
})

router.post('/ipv4FromString', rateLimiter, verify, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const {error} = ipFromStringValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {string} = req.body;
    const ipv4FromString = ipFromString(string);
    res.send(ipv4FromString);
})

router.post('/macAddressFromString', rateLimiter, verify, async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const {error} = macFromStringValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {string,format} = req.body;
    const macAddressFromString = macFromString(string,format);
    res.send(macAddressFromString);
})

router.post('/textRecognition', rateLimiter, upload.fields([{name:'image', maxCount: 1}]), async (req,res) => {
    // LETS VALIDATE THE DATA BEFORE WE pass it into the function
    const reqObjectLength = Object.keys(req.body).length;
    if(reqObjectLength !== 0) return res.status(400).send();
    if(!req.files.image || req.files.image.length <= 0) return res.status(400).send();
    const fileMetadata = req.files.image.pop();
    const {destination, mimetype, filename, path, size} = fileMetadata;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/pbm'];
    if(!allowedMimeTypes.includes(mimetype)) return res.status(400).send(`щ(ﾟДﾟщ) ${mimetype}`);
    // Create a new teseracrtTask

    // debug of file Metadata 
    //console.log(fileMetadata)

    const tesseractTask = new TesseractTask({
        ocrId: filename,
        status: 'null',
        progress: 0000000000,
        metaData: fileMetadata,
        result: "null",
    });

    // Checking if the user is already in the database
    const tesseractTaskExists = await TesseractTask.findOne({ocrId: filename});
    if(tesseractTaskExists) return res.status(400).send(`crId already exists : ${filename}`);
    const savedTesseract = await tesseractTask.save();
    const ocrCallBack = (data) => {
        const {status, progress} = data;
        TesseractTask.findOne({ocrId: filename}).then((t) => {
            t.status = status;
            t.progress = progress === 1 ? t.progress : progress;
            t.save();
        });
    };
    const imageFileData = await readFile(path);

  
    
    const ocrData = textRecognition(imageFileData, ocrCallBack).then((t) => {
        const result = t;
        TesseractTask.findOne({ocrId: filename}).then((t) => {
            t.result = result;
            t.progress = 1;
            t.save();
        }).catch(console.log);
    })
    deleteFile(path).then(console.log).catch(console.log);
    dirContents(destination).then((t) => {
        console.l
        if (t.length >= 100) t.forEach((fE) => {
            deleteFile(destination+"/"+fE).then(console.log).catch(console.log)
        });
    })
   

    res.send({ocrId: filename});
    //res.send({ocrData});
})

module.exports = router;