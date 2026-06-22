import { useState, useEffect } from 'react'
import './PostDetail.css'

function PostDetail({ isOpen, onClose, postId, user }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    if (isOpen && postId) {
      fetchPost()
    }
  }, [isOpen, postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPost({ ...post, likes: data.likes })
        
        if (data.isLiked) {
          setLikedPosts(new Set([...likedPosts, postId]))
        } else {
          setLikedPosts(new Set([...likedPosts].filter(id => id !== postId)))
        }
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleRepost = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/repost`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPost({ ...post, retweets: data.retweets })
      }
    } catch (error) {
      console.error('Error reposting:', error)
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      })

      if (response.ok) {
        const data = await response.json()
        setPost({ ...post, comments: data.comments })
        setCommentText('')
      }
    } catch (error) {
      console.error('Error commenting:', error)
    }
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
  }

  if (!isOpen) return null

  return (
    <div className="post-detail-overlay" onClick={onClose}>
      <div className="post-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="post-detail-header">
          <h2 className="post-detail-title">Post</h2>
          <button onClick={onClose} className="post-detail-close-button">✕</button>
        </div>

        <div className="post-detail-content">
          {loading ? (
            <div className="post-detail-loading">Loading...</div>
          ) : post ? (
            <>
              <div className="post-detail-post">
                <div className="post-detail-post-avatar">
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt="Profile" className="post-detail-avatar-image" />
                  ) : (
                    <div className="post-detail-avatar-placeholder">
                      {post.authorName?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="post-detail-post-content">
                  <div className="post-detail-post-header">
                    <span className="post-detail-post-author">{post.authorName}</span>
                    <span className="post-detail-post-handle">{post.authorHandle}</span>
                    <span className="post-detail-post-time">{post.timeAgo}</span>
                  </div>
                  {post.originalPost && (
                    <div className="post-detail-original-post">
                      <div className="post-detail-original-header">
                        <span className="post-detail-original-author">{post.originalPost.authorName}</span>
                        <span className="post-detail-original-handle">{post.originalPost.authorHandle}</span>
                      </div>
                      <p className="post-detail-original-text">{post.originalPost.content}</p>
                    </div>
                  )}
                  <p className="post-detail-post-text">{post.content}</p>
                  <div className="post-detail-post-actions">
                    <span className="post-detail-action post-detail-action-comment">
                      💬 <span className="post-detail-action-count">{post.comments?.length || 0}</span>
                    </span>
                    <span 
                      className="post-detail-action post-detail-action-retweet"
                      onClick={handleRepost}
                    >
                      🔄 <span className="post-detail-action-count">{post.retweets?.length || 0}</span>
                    </span>
                    <span 
                      className={`post-detail-action post-detail-action-like ${likedPosts.has(postId) ? 'post-detail-liked' : ''}`}
                      onClick={handleLike}
                    >
                      ❤️ <span className="post-detail-action-count">{post.likes?.length || 0}</span>
                    </span>
                    <span className="post-detail-action post-detail-action-share">🔗</span>
                  </div>
                </div>
              </div>

              <div className="post-detail-comments-section">
                <h3 className="post-detail-comments-title">Comments</h3>
                
                <div className="post-detail-comment-input-section">
                  <div className="post-detail-comment-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="post-detail-avatar-image" />
                    ) : (
                      <div className="post-detail-avatar-placeholder">
                        {user?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div className="post-detail-comment-input-wrapper">
                    <textarea
                      className="post-detail-comment-input"
                      placeholder="Post your reply"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={2}
                    />
                    <button
                      className="post-detail-comment-submit-button"
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>

                <div className="post-detail-comments-list">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment._id} className="post-detail-comment">
                        <div className="post-detail-comment-avatar">
                          {comment.authorAvatar ? (
                            <img src={comment.authorAvatar} alt="Profile" className="post-detail-avatar-image" />
                          ) : (
                            <div className="post-detail-avatar-placeholder">
                              {comment.authorName?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="post-detail-comment-content">
                          <div className="post-detail-comment-header">
                            <span className="post-detail-comment-author">{comment.authorName}</span>
                            <span className="post-detail-comment-handle">{comment.authorHandle}</span>
                            <span className="post-detail-comment-time">{getTimeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="post-detail-comment-text">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="post-detail-no-comments">No comments yet. Be the first to reply!</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="post-detail-error">Post not found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
