const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
const { cloudinaryConnect } = require("./config/cloudinary");
const connectDB = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const multer = require("multer");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();
const PORT = process.env.PORT || 4001;

//cookie parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const origin =
  process.env.NODE_ENV === "producation"
    ? process.env.CLIENT_URL
    : "http://localhost:3000";

app.use(
  cors({
    origin: [origin, "http://localhost:3000"],
    credentials: true,
    sameSite: "none",
  })
);

//listening to port
app.listen(PORT, () => {
  try {
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(`Error while running server ${error}`);
  }
});

//connect to database
connectDB();

//cloudinary config
cloudinaryConnect();

//default route
app.get("/", async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Ok from Server",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Default Route",
      error: error.message,
    });
  }
});

//all routes
app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/post", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Scheduled task to delete expired stories
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const currentTime = new Date();

//     // Find and delete expired stories
//     const expiredStories = await Story.find({
//       expiresAt: { $lt: currentTime },
//     });
//     await Story.deleteMany({ expiresAt: { $lt: currentTime } });

//     // Get the IDs of expired stories
//     const expiredStoryIds = expiredStories.map((story) => story._id);

//     // Remove expired story IDs from users
//     await User.updateMany(
//       { story: { $in: expiredStoryIds } },
//       { $pull: { story: { $in: expiredStoryIds } } }
//     );

//     // Delete images from Cloudinary
//     for (const expiredStory of expiredStories) {
//       await cloudinary.uploader.destroy(expiredStory.mediaUrl.public_id);
//     }

//     console.log(
//       "Expired stories, references, and images deleted from Cloudinary."
//     );
//   } catch (error) {
//     console.error("Error deleting expired stories:", error);
//   }
// });
