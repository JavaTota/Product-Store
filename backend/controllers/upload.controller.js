import cloudinary from "../config/cloudinary.js";

export const uploadImages = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !images.length) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    const uploads = await Promise.all(
      images.map((img) =>
        cloudinary.uploader.upload(img, {
          folder: "products",
          transformation: [
            { width: 800, height: 800, crop: "fill", gravity: "auto" },
          ],
        }),
      ),
    );

    const urls = uploads.map((u) => u.secure_url);

    res.status(200).json({
      success: true,
      urls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Images upload failed",
    });
  }
};
