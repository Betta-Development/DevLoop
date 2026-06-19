import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Post from '../models/Post.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'devloop-secret-key-change-in-production'

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' })
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already taken' })
      }
    }

    const user = new User({
      username,
      email,
      password
    })

    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Server error during signup' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        pronouns: user.pronouns,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        skills: user.skills,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        pronouns: user.pronouns,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        skills: user.skills,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error getting profile' })
  }
})

router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const { bio, pronouns, website, github, linkedin, twitter, skills, location, avatar, banner } = req.body

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        bio: bio || '',
        pronouns: pronouns || '',
        website: website || '',
        github: github || '',
        linkedin: linkedin || '',
        twitter: twitter || '',
        skills: skills || [],
        location: location || '',
        avatar: avatar || '',
        banner: banner || ''
      },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update avatar in all posts by this user
    if (avatar !== undefined) {
      await Post.updateMany(
        { author: decoded.userId },
        { authorAvatar: avatar || '' }
      )
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        banner: user.banner,
        pronouns: user.pronouns,
        location: user.location,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        skills: user.skills,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error updating profile' })
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        banner: user.banner,
        pronouns: user.pronouns,
        location: user.location,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        skills: user.skills,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Get user by ID error:', error)
    res.status(500).json({ message: 'Server error getting user' })
  }
})

export default router
