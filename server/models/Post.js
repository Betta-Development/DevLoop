import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorHandle: {
    type: String,
    required: true
  },
  authorAvatar: {
    type: String,
    default: ''
  },
  hashtags: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    _id: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: String,
    authorHandle: String,
    authorAvatar: String,
    content: String,
    createdAt: Date
  }],
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

postSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const hashtagRegex = /#(\w+)/g
    const matches = this.content.match(hashtagRegex)
    this.hashtags = matches ? matches.map(tag => tag.toLowerCase()) : []
  }
  next()
})

const Post = mongoose.model('Post', postSchema)

export default Post
