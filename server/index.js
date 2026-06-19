import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devloop')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevLoop API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
