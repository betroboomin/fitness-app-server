const express = require('express');
const multer = require('multer');
const path = require('path');
const Photo = require('../models/photomodel');

// ... Your other middleware and routes ...

// Serve uploaded images from the 'uploads' directory

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log(req.file);
    const photo = new Photo({
      caption: req.body.caption,
      imageUrl: `/uploads/${req.file.filename}`,
    });
    await photo.save();
    console.log(photo);
    res.send(photo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.send(photos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}
);


module.exports = router;

