import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async function(buffer) {
    try {
        if (buffer) {
            const response = await cloudinary.uploader.upload_stream({
                folder: 'book_covers', // Optional: specify a folder
            }, (error, result) => {
                if (result) {
                    console.log("File uploaded successfully!", result.url);
                    return result.url;
                } else {
                    console.error("Upload error:", error);
                    return null;
                }
            }).end(buffer);
            return response;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error during upload:", error);
        return null;
    }
}

export { uploadOnCloudinary };




// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// // Configuration
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async function(filepath){
//     try {
//         if (filepath) {
//             const response = await cloudinary.uploader.upload(filepath);
//             console.log("File uploaded successfully!", response.url);
//             return response.url;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         fs.unlinkSync(filepath);
//         return null;
//     }
// }

// export { uploadOnCloudinary };
