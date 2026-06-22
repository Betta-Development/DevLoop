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

    const { content, originalPostId } = req.body

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' })
    }

    const post = new Post({
      content,
      author: user._id,
      authorName: user.username,
      authorHandle: `@${user.username.toLowerCase()}`,
      authorAvatar: user.avatar || '',
      originalPost: originalPostId || null
    })

    await post.save()

    // If this is a repost, add to original post's retweets
    if (originalPostId) {
      await Post.findByIdAndUpdate(originalPostId, {
        $push: { retweets: user._id }
      })
    }

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

// Like/Unlike post
router.post('/:postId/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const { postId } = req.params
    const userId = decoded.userId

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId)
    } else {
      // Like
      post.likes.push(userId)
    }

    await post.save()

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      isLiked: !isLiked
    })
  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({ message: 'Server error liking post' })
  }
})

// Repost/Unrepost
router.post('/:postId/repost', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const { postId } = req.params
    const userId = decoded.userId

    const originalPost = await Post.findById(postId)

    if (!originalPost) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isReposted = originalPost.retweets.includes(userId)

    if (isReposted) {
      // Unrepost - remove from retweets and delete the repost post
      originalPost.retweets = originalPost.retweets.filter(id => id.toString() !== userId)
      await originalPost.save()
      
      // Delete the repost post
      await Post.deleteOne({ originalPost: postId, author: userId })

      res.json({
        message: 'Post unreposted',
        retweets: originalPost.retweets.length,
        isReposted: false
      })
    } else {
      // Repost - create new post and add to retweets
      const repost = new Post({
        content: '', // Empty content for repost
        author: userId,
        authorName: user.username,
        authorHandle: `@${user.username.toLowerCase()}`,
        authorAvatar: user.avatar || '',
        originalPost: postId
      })

      await repost.save()

      originalPost.retweets.push(userId)
      await originalPost.save()

      res.json({
        message: 'Post reposted',
        retweets: originalPost.retweets.length,
        isReposted: true
      })
    }
  } catch (error) {
    console.error('Repost error:', error)
    res.status(500).json({ message: 'Server error reposting' })
  }
})

// Comment on post
router.post('/:postId/comment', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const { postId } = req.params
    const { content } = req.body
    const userId = decoded.userId

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' })
    }

    const comment = {
      _id: new Date().getTime().toString(),
      author: userId,
      authorName: user.username,
      authorHandle: `@${user.username.toLowerCase()}`,
      authorAvatar: user.avatar || '',
      content,
      createdAt: new Date()
    }

    post.comments.push(comment)
    await post.save()

    res.json({
      message: 'Comment added successfully',
      comments: post.comments.length,
      comment
    })
  } catch (error) {
    console.error('Comment error:', error)
    res.status(500).json({ message: 'Server error adding comment' })
  }
})

// Get post with comments
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    let originalPostData = null
    if (post.originalPost) {
      originalPostData = await Post.findById(post.originalPost)
    }

    res.json({
      _id: post._id,
      content: post.content,
      authorId: post.author,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      authorAvatar: post.authorAvatar,
      hashtags: post.hashtags,
      likes: post.likes,
      retweets: post.retweets,
      comments: post.comments,
      originalPost: originalPostData ? {
        _id: originalPostData._id,
        content: originalPostData.content,
        authorName: originalPostData.authorName,
        authorHandle: originalPostData.authorHandle,
        authorAvatar: originalPostData.authorAvatar
      } : null,
      timeAgo: getTimeAgo(post.createdAt)
    })
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({ message: 'Server error getting post' })
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
