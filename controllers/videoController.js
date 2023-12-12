const fs = require("fs");
const path = require("path");
const rangeParser = require("range-parser");
const Video = require("../models/Video");

async function uploadVideo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Extract new video name from request body
    const { videoName } = req.body;

    // Validate if new video name is provided
    if (!videoName) {
      return res.status(400).send("videoName is required.");
    }

    const videoPath = path.join(
      __dirname,
      "../public/uploads",
      `${videoName}.mp4`
    );
    await fs.writeFile(videoPath, req.file.buffer);

    const fullVideoPath = path.resolve(videoPath);

    const video = new Video({ name: `${videoName}.mp4`, path: fullVideoPath });
    await video.save();

    res.send("Video uploaded successfully.");
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function streamVideo(req, res) {
    const videoName = req.params.videoName;
  
    try {
      // Retrieve the video path from the database based on the video name
      const video = await Video.findOne({ name: videoName });
  
      if (!video) {
        return res.status(404).send("Video not found");
      }
  
      const videoPath = path.join(__dirname, "../public/uploads", video.name);
  
      res.header("Content-Type", "video/mp4");
      res.header("Accept-Ranges", "bytes");
      res.header("Content-Disposition", "inline");
  
      // Use util.promisify to convert fs.stat to promise-based
      const stat = await fs.promises.stat(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (range) {
        const parts = rangeParser(fileSize, range, { combine: true });
  
        if (parts instanceof Array) {
          const start = parts[0].start;
          const end = parts[0].end;
  
          const stream = fs.createReadStream(videoPath, { start, end });
          res.status(206);
          stream.pipe(res);
        } else {
          res.status(416).send("Range Not Satisfiable");
        }
      } else {
        const stream = fs.createReadStream(videoPath);
        res.status(200);
        stream.pipe(res);
      }
    } catch (error) {
      console.error("Error streaming video:", error);
      res.status(500).send("Internal Server Error");
    }
  }

module.exports = {
  uploadVideo,
  streamVideo,
};
