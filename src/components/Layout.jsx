import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Layout({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { username: 'Developer', avatar: '' })
  const [trending, setTrending] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/trending')
      if (response.ok) {
        const data = await response.json()
        setTrending(data)
      }
    } catch (error) {
      console.error('Error fetching trending:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleNavItemClick = (path) => {
    navigate(path)
  }

  const handleTrendingClick = (tag) => {
    navigate(`/hashtag/${tag}`)
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftSidebar}>
        <div style={styles.logo} onClick={() => handleNavItemClick('/home')}>DevLoop</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => handleNavItemClick('/home')}>
            <span style={styles.navIcon}>🏡</span>
            <span style={styles.navText}>Home</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>🌎</span>
            <span style={styles.navText}>Explore</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>🔔</span>
            <span style={styles.navText}>Notifications</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>💬</span>
            <span style={styles.navText}>Messages</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>🔖</span>
            <span style={styles.navText}>Bookmarks</span>
          </div>
        </nav>
        <div style={styles.profileSection} onClick={handleProfileClick}>
          <div style={styles.profileAvatar}>
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" style={styles.avatarImage} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileName}>{user.username}</div>
            <div style={styles.profileHandle}>@{user.username.toLowerCase()}</div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {children}
      </div>

      <div style={styles.rightSidebar}>
        <div style={styles.trendingContainer}>
          <h3 style={styles.trendingTitle}>Trending for Developers</h3>
          {trending.length === 0 ? (
            <div style={styles.noTrending}>
              <p style={styles.noTrendingText}>No trending hashtags yet</p>
            </div>
          ) : (
            trending.map((item, index) => (
              <div 
                key={index} 
                style={styles.trendingItem}
                onClick={() => handleTrendingClick(item.tag)}
              >
                <div style={styles.trendingTag}>#{item.tag}</div>
                <div style={styles.trendingPosts}>{item.count} posts</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#000000'
  },
  leftSidebar: {
    width: '260px',
    padding: '16px',
    borderRight: '2px solid #444',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: '#000000'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '20px',
    cursor: 'pointer',
    letterSpacing: '-0.3px'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginBottom: '20px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent'
  },
  navIcon: {
    fontSize: '22px',
    color: '#ffffff'
  },
  navText: {
    fontSize: '16px',
    color: '#ffffff',
    fontWeight: '600'
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'all 0.2s ease',
    border: '1px solid #333'
  },
  profileAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    border: '2px solid #333'
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
    backgroundColor: '#1a1a1a'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '2px'
  },
  profileHandle: {
    fontSize: '14px',
    color: '#71767b',
    fontWeight: '500'
  },
  mainContent: {
    flex: 1,
    borderRight: '1px solid #333',
    maxWidth: '600px',
    overflowY: 'auto'
  },
  rightSidebar: {
    width: '300px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  trendingContainer: {
    backgroundColor: '#0d0d0d',
    borderRadius: '12px',
    padding: '16px',
    border: '2px solid #444'
  },
  trendingTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '16px',
    letterSpacing: '-0.2px'
  },
  trendingItem: {
    padding: '12px 0',
    borderBottom: '1px solid #333',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent'
  },
  trendingTag: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '3px',
    letterSpacing: '-0.1px'
  },
  trendingPosts: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '500'
  },
  noTrending: {
    padding: '20px',
    textAlign: 'center'
  },
  noTrendingText: {
    fontSize: '14px',
    color: '#888',
    margin: 0
  }
}

export default Layout
