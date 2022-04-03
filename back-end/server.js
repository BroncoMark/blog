const express = require('express');
const bodyParser = require("body-parser");
const CONFIG = require("./config.json");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const blogSchema = new mongoose.Schema({
  timestamp: String,
  title: String,
  post: String,
  path: String,
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

mongoose.connect('mongodb+srv://' + CONFIG.dbUser + ':' + CONFIG.dbPassword + '@cluster0.47wro.mongodb.net/' + CONFIG.dbDatabase + '?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

app.listen(3001, () => console.log('Server listening on port 3001!'));

app.post('/api/blogposts', async (req, res) => {
  const blog_post = new BlogPost({
    timestamp: req.body.timestamp,
    title: req.body.title,
    post: req.body.post,
    path: req.body.path,
  });
  try {
    await blog_post.save();
    res.send(blog_post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/blogposts', async (req, res) => {
  try {
    let blog_posts = await BlogPost.find();
    res.send(blog_posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/blogposts/:id', async(req, res) => {
  console.log("Post");
  try {
    await BlogPost.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/blogposts/:id', async(req, res) => {
  console.log("Put");
  try {
    let blog_post = await BlogPost.findOne({
      _id: req.params.id
    });
    blog_post.title = req.body.title;
    blog_post.post = req.body.post;
    await blog_post.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
