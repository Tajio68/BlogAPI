const express = require("express");
const mongoose = require("mongoose");
const { Pool } = require("pg");
require("dotenv").config();

const Article = require("./models/article");
const Comment = require("./models/comment");

const app = express();
app.use(express.json());

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"));

app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().lean();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).send(`Server error : ${error.message}`);
  }
});

app.post("/articles", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const article = new Article({ title, content, author });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).send(`Server error : ${error.message}`);
  }
});

app.put("/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true }
    );
    if (!article) return res.status(404).send("Article not found");
    res.status(200).json(article);
  } catch (error) {
    res.status(500).send(`Server error : ${error.message}`);
  }
});

app.delete("/articles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findByIdAndDelete(id);
    if (!article) return res.status(404).send("Article not found");
    res.status(204).json(article);
  } catch (error) {
    res.status(500).send(`Server error : ${error.message}`);
  }
});

app.post("/comments", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).send(`Server error : ${error.message}`);
  }
});

app.get("/articles/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ article: id }).lean();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send(`Server error : ${error.message}`);
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
