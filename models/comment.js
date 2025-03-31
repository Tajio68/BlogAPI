const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3 },
  author: { type: String, required: true },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
