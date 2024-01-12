const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs").promises;
const path = require("path");
const app = require("../app"); // Import your Express app instance
const Video = require("../models/Video");

const { expect } = chai;
chai.use(chaiHttp);

describe("POST /upload-video", () => {
  it("should upload a video successfully", async () => {
    const response = await chai
      .request(app)
      .post("/upload-video")
      .field("videoName", "testVideo")
      .attach("file", "test/test-video.mp4", "test-video.mp4");

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("message").equal("Video uploaded successfully.");

    // Check if the video is saved in the database
    const video = await Video.findOne({ name: "testVideo.mp4" });
    expect(video).to.exist;
    expect(video.name).to.equal("testVideo.mp4");
    expect(video.path).to.exist;
  });

  it("should handle missing videoName", async () => {
    const response = await chai
      .request(app)
      .post("/upload-video")
      .attach("file", "test/test-video.mp4", "test-video.mp4");
  
    // Expect a 400 Bad Request status code for missing videoName
    expect(response).to.have.status(400);
    expect(response.body).to.have.property("error").equal("videoName is required.");
  });

  it("should handle missing file", async () => {
    const response = await chai.request(app).post("/upload-video").field("videoName", "testVideo");

    expect(response).to.have.status(400);
    expect(response.body).to.have.property("error").equal("No file uploaded.");
  });
});
