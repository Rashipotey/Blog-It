import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { ClerkExpressWithAuth, requireAuth } from '@clerk/clerk-sdk-node';
import cloudinary from './cloudinary.js'; // Your Cloudinary config

dotenv.config();

const app = express();
const PORT = 3001;

// In-memory storage for blog posts (replace with DB later)
let blogPosts = [];

app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());
const upload = multer();

// Get daily quote
app.get('/api/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/quotes');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ message: 'Failed to fetch quote' });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  res.json(blogPosts);
});

// Get logged-in user's posts
app.get('/api/my-posts', requireAuth, (req, res) => {
  const userId = req.auth.userId;
  const userPosts = blogPosts.filter(post => post.userId === userId);
  res.json(userPosts);
});

// Get public posts not by the user
app.get('/api/public-posts', requireAuth, (req, res) => {
  const userId = req.auth.userId;
  const publicPosts = blogPosts.filter(post => post.public && post.userId !== userId);
  res.json(publicPosts);
});

// Create a new post with image upload
app.post('/api/posts', requireAuth, upload.single('image'), async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { title, content, public: isPublic = true } = req.body;

  try {
    let imageUrl = null;

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadedImage = await cloudinary.uploader.upload(base64Image, {
        folder: 'blog-posts',
      });
      imageUrl = uploadedImage.secure_url;
    }

    const newPost = {
      id: Date.now().toString(), // Unique ID
      userId,
      title,
      content,
      public: isPublic,
      date: new Date().toISOString(),
      image: imageUrl,
    };

    blogPosts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// Get a single post (only owner can access)
app.get('/api/posts/:id', requireAuth, (req, res) => {
  const post = blogPosts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.userId !== req.auth.userId) return res.status(403).json({ message: 'Unauthorized' });
  res.json(post);
});

// Update a post (only owner can update)
app.put('/api/posts/:id', requireAuth, (req, res) => {
  const postIndex = blogPosts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });

  const post = blogPosts[postIndex];
  if (post.userId !== req.auth.userId) return res.status(403).json({ message: 'Unauthorized' });

  const { title, content } = req.body;

  blogPosts[postIndex] = {
    ...post,
    title: title || post.title,
    content: content || post.content,
  };

  res.json(blogPosts[postIndex]);
});

// Delete a post (only owner can delete)
app.delete('/api/posts/:id', requireAuth, (req, res) => {
  const postIndex = blogPosts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });

  const post = blogPosts[postIndex];
  if (post.userId !== req.auth.userId) return res.status(403).json({ message: 'Unauthorized' });

  blogPosts.splice(postIndex, 1);
  res.json({ message: 'Post deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
