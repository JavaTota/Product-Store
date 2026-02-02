import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const fileStr = req.body.image;

    if (!fileStr) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const uploaded = await cloudinary.uploader.upload(fileStr, {
      folder: "products",
      transformation: [
        {
          width: 800,
          height: 800,
          crop: "fill",
          gravity: "auto",
        },
      ],
    });

    res.status(200).json({
      success: true,
      url: uploaded.secure_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};
