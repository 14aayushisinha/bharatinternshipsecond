const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Check for MongoDB connection error
db.on('error', err => {
    console.error('MongoDB connection error:', err);
});

// Define post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Create post model
const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Error fetching posts');
    }
});

app.post('/posts', async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Post({
        title,
        content
    });
    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (err) {
        console.error('Error saving post:', err);
        res.status(500).send('Error saving post');
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});