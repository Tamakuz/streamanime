import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
  resolution: String,
  streamUrl: String
});

const Stream = mongoose.models.Stream || mongoose.model("Stream", streamSchema);

export default Stream;