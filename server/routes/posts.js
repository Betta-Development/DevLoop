import express from 'express'
import jwt from 'jsonwebtoken'
import Post from '../models/Post.js'
import User from '../models/User.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'devloop-secret-key-change-in-production'

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .limit(50)
    
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      content: post.content,
      authorId: post.author,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      authorAvatar: post.authorAvatar,
      hashtags: post.hashtags,
      likes: post.likes.length,
      retweets: post.retweets.length,
      comments: post.comments.length,
      timeAgo: getTimeAgo(post.createdAt)
    }))

    res.json(formattedPosts)
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ message: 'Server error getting posts' })
  }
})

router.get('/hashtag/:tag', async (req, res) => {
  try {
    const { tag } = req.params
    const posts = await Post.find({ hashtags: tag.toLowerCase() })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .limit(50)
    
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      content: post.content,
      authorId: post.author,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      authorAvatar: post.authorAvatar,
      hashtags: post.hashtags,
      likes: post.likes.length,
      retweets: post.retweets.length,
      comments: post.comments.length,
      timeAgo: getTimeAgo(post.createdAt)
    }))

    res.json(formattedPosts)
  } catch (error) {
    console.error('Get posts by hashtag error:', error)
    res.status(500).json({ message: 'Server error getting posts by hashtag' })
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(50)
    
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      content: post.content,
      authorId: post.author,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      authorAvatar: post.authorAvatar,
      hashtags: post.hashtags,
      likes: post.likes.length,
      retweets: post.retweets.length,
      comments: post.comments.length,
      timeAgo: getTimeAgo(post.createdAt)
    }))

    res.json(formattedPosts)
  } catch (error) {
    console.error('Get posts by user error:', error)
    res.status(500).json({ message: 'Server error getting posts by user' })
  }
})

router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.find({ hashtags: { $exists: true, $ne: [] } })
    
    const hashtagCounts = {}
    posts.forEach(post => {
      post.hashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
      })
    })

    const sortedHashtags = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    res.json(sortedHashtags)
  } catch (error) {
    console.error('Get trending error:', error)
    res.status(500).json({ message: 'Server error getting trending hashtags' })
  }
})

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { content } = req.body

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' })
    }

    const post = new Post({
      content,
      author: user._id,
      authorName: user.username,
      authorHandle: `@${user.username.toLowerCase()}`,
      authorAvatar: user.avatar || ''
    })

    await post.save()

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        _id: post._id,
        content: post.content,
        authorName: post.authorName,
        authorHandle: post.authorHandle,
        authorAvatar: post.authorAvatar,
        hashtags: post.hashtags,
        likes: post.likes.length,
        retweets: post.retweets.length,
        comments: post.comments.length,
        timeAgo: getTimeAgo(post.createdAt)
      }
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ message: 'Server error creating post' })
  }
})

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

export default router
