import multer from "multer";

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: 'your_api_key',
    api_secret: 'your_api_secret'
});

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book_covers', // The folder in Cloudinary where you want to store the images
        format: async (req, file) => 'png', // Supports promises as well
        public_id: (req, file) => file.originalname.split('.')[0], // The name of the file in Cloudinary
    },
});


export const upload = multer({ storage: storage });
