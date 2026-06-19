import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import EditProfile from './EditProfile'

function Profile() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const currentUser = JSON.parse(localStorage.getItem('user')) || { id: null }
  const isOwnProfile = !userId || userId === currentUser.id
  
  const [user, setUser] = useState(isOwnProfile ? currentUser : {
    username: 'Developer',
    email: 'developer@example.com',
    bio: '',
    avatar: '',
    banner: '',
    pronouns: '',
    location: '',
    skills: [],
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    createdAt: new Date()
  })
  const [posts, setPosts] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (userId && !isOwnProfile) {
      fetchUserProfile()
    }
  }, [userId])

  useEffect(() => {
    if (user.id) {
      fetchUserPosts()
    }
  }, [user.id])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/posts/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
    }
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveProfile = (updatedUser) => {
    setUser(updatedUser)
  }

  const handleBackClick = () => {
    navigate('/home')
  }

  return (
    <>
      <div style={styles.header}>
        <button onClick={handleBackClick} style={styles.backButton}>← Back</button>
        <div style={styles.headerTitle}>Profile</div>
      </div>

      <div style={styles.profileSection}>
        <div style={styles.coverPhoto}>
          {user.banner ? (
            <img src={user.banner} alt="Banner" style={styles.bannerImage} />
          ) : null}
        </div>
        <div style={styles.profileContent}>
          <div style={styles.avatarSection}>
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" style={styles.avatarImage} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={styles.profileDetails}>
            <div style={styles.profileHeader}>
              <h1 style={styles.username}>{user.username}</h1>
              {isOwnProfile && <button onClick={handleEditProfile} style={styles.editButton}>Edit Profile</button>}
            </div>
            <div style={styles.userHandle}>@{user.username.toLowerCase()}</div>
            {user.pronouns && <div style={styles.pronouns}>{user.pronouns}</div>}
            {user.location && <div style={styles.location}>📍 {user.location}</div>}
            {user.bio && <p style={styles.bio}>"{user.bio}"</p>}
            
            <div style={styles.metaInfo}>
              <span style={styles.metaItem}>📅 Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>

            {(user.website || user.github || user.linkedin || user.twitter) && (
              <div style={styles.socialLinks}>
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    🔗 {user.website}
                  </a>
                )}
                {user.github && (
                  <a href={`https://${user.github}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    💻 {user.github}
                  </a>
                )}
                {user.linkedin && (
                  <a href={`https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    💼 {user.linkedin}
                  </a>
                )}
                {user.twitter && (
                  <a href={`https://${user.twitter}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    🐦 {user.twitter}
                  </a>
                )}
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div style={styles.skillsSection}>
                <h3 style={styles.skillsTitle}>Skills</h3>
                <div style={styles.skillsList}>
                  {user.skills.map((skill, index) => (
                    <span key={index} style={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.postsSection}>
        <h2 style={styles.postsTitle}>Posts</h2>
        {posts.length === 0 ? (
          <div style={styles.noPosts}>
            <p style={styles.noPostsText}>No posts yet</p>
            <p style={styles.noPostsSubtext}>When you post, they'll show up here</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} style={styles.post}>
              <div style={styles.postAvatar}>
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt="Profile" style={styles.avatarImage} />
                ) : (
                  <div style={styles.avatarPlaceholder}>{post.authorName.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div style={styles.postContent}>
                <div style={styles.postHeader}>
                  <span style={styles.postAuthor}>{post.authorName}</span>
                  <span style={styles.postHandle}>@{post.authorHandle}</span>
                  <span style={styles.postTime}>{post.timeAgo}</span>
                </div>
                <p style={styles.postText}>{post.content}</p>
                <div style={styles.postActions}>
                  <span style={styles.postAction}>💬 {post.comments || 0}</span>
                  <span style={styles.postAction}>🔄 {post.retweets || 0}</span>
                  <span style={styles.postAction}>❤️ {post.likes || 0}</span>
                  <span style={styles.postAction}>🔗</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <EditProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    backgroundColor: '#000000',
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
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  profileSection: {
    borderBottom: '1px solid #333'
  },
  coverPhoto: {
    height: '150px',
    backgroundColor: '#1a1a1a',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overflow: 'hidden'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  profileContent: {
    padding: '16px'
  },
  avatarSection: {
    marginTop: '-60px',
    marginBottom: '12px'
  },
  avatarImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #000000'
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: '800',
    color: '#ffffff',
    border: '4px solid #000000'
  },
  profileDetails: {
    marginTop: '8px'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  username: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #333',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  userHandle: {
    fontSize: '16px',
    color: '#71767b',
    marginBottom: '8px'
  },
  pronouns: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '12px'
  },
  location: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '12px'
  },
  bio: {
    fontSize: '16px',
    color: '#ffffff',
    lineHeight: '1.5',
    marginBottom: '12px',
    margin: '0 0 12px 0',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  metaInfo: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px'
  },
  metaItem: {
    fontSize: '14px',
    color: '#888'
  },
  socialLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  socialLink: {
    fontSize: '14px',
    color: '#1d9bf0',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  skillsSection: {
    marginTop: '16px',
    marginBottom: '16px'
  },
  skillsTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '8px'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  skillTag: {
    padding: '6px 12px',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    fontSize: '14px',
    color: '#ffffff',
    border: '1px solid #333'
  },
  postsSection: {
    padding: '16px'
  },
  postsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '16px'
  },
  post: {
    padding: '16px 0',
    borderBottom: '1px solid #333',
    display: 'flex',
    gap: '12px'
  },
  postAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#333',
    flexShrink: 0
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
    fontWeight: 'bold',
    color: '#ffffff'
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
    cursor: 'pointer'
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
  }
}

export default Profile
