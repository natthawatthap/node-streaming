const express = require('express');
const multer = require('multer');
const cors = require('cors');
const videoController = require('../controllers/videoController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(cors());

router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/stream/:videoName', videoController.streamVideo);

module.exports = router;
