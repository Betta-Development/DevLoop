import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function HashtagFeed() {
  const { tag } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPostsByHashtag()
  }, [tag])

  const fetchPostsByHashtag = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/posts/hashtag/${tag}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    navigate('/home')
  }

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={handleBackClick} style={styles.backButton}>← Back</button>
        <div style={styles.headerTitle}>#{tag}</div>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <p style={styles.loadingText}>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div style={styles.noPosts}>
          <p style={styles.noPostsText}>No posts with #{tag} yet</p>
          <p style={styles.noPostsSubtext}>Be the first to post with this hashtag!</p>
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
              <p style={styles.postText}>{formatHashtags(post.content)}</p>
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

function formatHashtags(text) {
  const parts = text.split(/(#\w+)/g)
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      return <span key={index} style={styles.hashtag}>{part}</span>
    }
    return part
  })
}

const styles = {
  container: {
    backgroundColor: '#000000',
    animation: 'fadeIn 0.5s ease-out'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    zIndex: 10
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px',
    marginRight: '16px'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.3px'
  },
  loading: {
    padding: '60px 20px',
    textAlign: 'center'
  },
  loadingText: {
    fontSize: '16px',
    color: '#888',
    margin: 0
  },
  noPosts: {
    padding: '60px 20px',
    textAlign: 'center'
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
  },
  post: {
    padding: '16px',
    borderBottom: '1px solid #333',
    display: 'flex',
    gap: '12px',
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
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: '#333'
  },
  postContent: {
    flex: 1
  },
  postHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px'
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
  hashtag: {
    color: '#1d9bf0',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
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
  }
}

export default HashtagFeed
