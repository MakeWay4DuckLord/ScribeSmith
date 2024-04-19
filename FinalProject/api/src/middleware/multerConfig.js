const multer = require('multer');
const path = require('path');

// Set up Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'static/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage
}).single("image");


module.exports = upload;