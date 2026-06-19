import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function HashtagTextarea({ value, onChange, placeholder }) {
  const textareaRef = useRef(null)
  const [hasHashtag, setHasHashtag] = useState(false)

  const handleChange = (e) => {
    onChange(e)
    const text = e.target.value
    setHasHashtag(text.includes('#'))
  }

  return (
    <>
      <style>{`
        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .hashtag-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1d9bf0;
          animation: rippleEffect 1s ease-out infinite;
        }
      `}</style>
      <div style={hashtagTextareaStyles.container}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          style={hashtagTextareaStyles.textarea}
        />
        {hasHashtag && <div className="hashtag-indicator" />}
      </div>
    </>
  )
}

const hashtagTextareaStyles = {
  container: {
    position: 'relative',
    width: '100%'
  },
  textarea: {
    width: '100%',
    backgroundColor: '#000000',
    border: 'none',
    color: '#ffffff',
    fontSize: '18px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  }
}

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { username: 'Developer', avatar: '' })
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return

    setIsPosting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost })
      })

      if (response.ok) {
        setNewPost('')
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`)
  }

  return (
    <div style={styles.container}>
        <div style={styles.feedHeader}>
          <h2 style={styles.feedTitle}>Home</h2>
        </div>
        
        <div style={styles.createPost}>
          <div style={styles.createPostAvatar}>
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" style={styles.avatarImage} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={styles.createPostInput}>
            <HashtagTextarea 
              placeholder="What's happening?" 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div style={styles.createPostActions}>
              <button 
                style={styles.postButton}
                onClick={handlePostSubmit}
                disabled={isPosting || !newPost.trim()}
                onMouseEnter={(e) => {
                  if (!isPosting && newPost.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 255, 255, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)'
                }}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div style={styles.noPosts}>
            <p style={styles.noPostsText}>No posts yet</p>
            <p style={styles.noPostsSubtext}>Be the first to share something with the DevLoop community!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post._id} 
              style={styles.post}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(29, 155, 240, 0.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div 
                style={styles.postAvatar} 
                onClick={() => handleProfileClick(post.authorId)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = '#333'
                }}
              >
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt="Profile" style={styles.avatarImage} />
                ) : (
                  <div style={styles.avatarPlaceholder}>{post.authorName.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div style={styles.postContent}>
                <div style={styles.postHeader}>
                  <span 
                    style={styles.postAuthor} 
                    onClick={() => handleProfileClick(post.authorId)}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1d9bf0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                  >{post.authorName}</span>
                  <span style={styles.postHandle}>{post.authorHandle}</span>
                  <span style={styles.postTime}>{post.timeAgo}</span>
                </div>
                <p style={styles.postText}>{post.content}</p>
                <div style={styles.postActions}>
                  <span 
                    style={styles.postAction}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1d9bf0'
                      e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#888'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >💬 {post.comments || 0}</span>
                  <span 
                    style={styles.postAction}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#00ba7c'
                      e.currentTarget.style.background = 'rgba(0, 186, 124, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#888'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >🔄 {post.retweets || 0}</span>
                  <span 
                    style={styles.postAction}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f91880'
                      e.currentTarget.style.background = 'rgba(249, 24, 128, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#888'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >❤️ {post.likes || 0}</span>
                  <span 
                    style={styles.postAction}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1d9bf0'
                      e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#888'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >�</span>
                </div>
              </div>
            </div>
          ))
        )}
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#000000',
    animation: 'fadeIn 0.5s ease-out'
  },
  feedHeader: {
    padding: '20px',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    zIndex: 10
  },
  feedTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.3px'
  },
  createPost: {
    padding: '20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    gap: '15px',
    animation: 'slideIn 0.3s ease-out'
  },
  createPostAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    flexShrink: 0,
    border: '2px solid #333',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  createPostInput: {
    flex: 1
  },
  textarea: {
    width: '100%',
    backgroundColor: '#000000',
    border: 'none',
    color: '#ffffff',
    fontSize: '18px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit'
  },
  createPostActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '15px'
  },
  postButton: {
    padding: '12px 28px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
  },
  post: {
    padding: '20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    gap: '15px',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.4s ease-out'
  },
  postAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    flexShrink: 0,
    cursor: 'pointer',
    border: '2px solid #333',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  postContent: {
    flex: 1
  },
  postHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px'
  },
  postAuthor: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  },
  postHandle: {
    fontSize: '14px',
    color: '#888'
  },
  postTime: {
    fontSize: '14px',
    color: '#888'
  },
  postText: {
    fontSize: '16px',
    color: '#ffffff',
    lineHeight: '1.5',
    marginBottom: '12px'
  },
  postActions: {
    display: 'flex',
    gap: '20px'
  },
  postAction: {
    fontSize: '14px',
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '4px 8px',
    borderRadius: '8px'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  noPosts: {
    padding: '60px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #333'
  },
  noPostsText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 8px 0'
  },
  noPostsSubtext: {
    fontSize: '16px',
    color: '#888',
    margin: 0
  }
}

export default Home
