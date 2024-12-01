const express = require("express");
const multer = require("multer");
const Model = require("../models/3dmodel.model");
const path = require("path"); // Import path module

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /upload
router.post("/uploadModel", upload.single("file"), async (req, res) => {
  try {
    console.log('path.resolame)', path.resolve(__dirname, "../uploads", req.file.filename))
    const { name, description } = req.body;
    const model = new Model({
      name,
      description,
      uploadDate: new Date(),
      url: path.resolve(__dirname, "../uploads", req.file.filename),
    });
    await model.save();
    res.status(201).json({ message: "Model uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload model" });
  }
});
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    // Define the filter criteria
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive search in "name"
            { description: { $regex: search, $options: "i" } }, // Case-insensitive search in "description"
          ],
        }
      : {}; // No filter if no search term is provided

    // Fetch and sort models
    const models = await Model.find(filter).sort({ uploadDate: -1 });

    res.json(models);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

module.exports = router;
