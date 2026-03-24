const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config({ path: path.join(__dirname, '../.env') });

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Database connection with fallback to in-memory
async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === "production";

  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not set");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000, // Timeout after 3s instead of 30s
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    if (isProduction) {
      throw new Error(
        `Failed to connect to MongoDB in production: ${error.message}`
      );
    }

    console.log("Local MongoDB not available, starting in-memory database...");

    // Start in-memory MongoDB server
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to in-memory MongoDB for development");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

connectDatabase().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

module.exports = app;
