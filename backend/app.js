const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path"); // Import path module

const modelRoutes = require("./routes/model.route");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/models", modelRoutes);
// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
