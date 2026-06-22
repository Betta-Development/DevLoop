import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Settings from './Settings'

function Layout({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { username: 'Developer', avatar: '' })
  const [trending, setTrending] = useState([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftSidebar}>
        <div 
          style={styles.logo} 
          onClick={() => handleNavItemClick('/home')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >DevLoop</div>
        <nav style={styles.nav}>
          <div 
            style={styles.navItem} 
            onClick={() => handleNavItemClick('/home')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.3)'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1)'
            }}
          >
            <span style={styles.navIcon}>🏡</span>
            <span style={styles.navText}>Home</span>
          </div>
          <div 
            style={styles.navItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.3)'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1)'
            }}
          >
            <span style={styles.navIcon}>🌎</span>
            <span style={styles.navText}>Explore</span>
          </div>
          <div 
            style={styles.navItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.3)'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1)'
            }}
          >
            <span style={styles.navIcon}>🔔</span>
            <span style={styles.navText}>Notifications</span>
          </div>
          <div 
            style={styles.navItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.3)'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1)'
            }}
          >
            <span style={styles.navIcon}>💬</span>
            <span style={styles.navText}>Messages</span>
          </div>
          <div 
            style={styles.navItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.3)'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1)'
            }}
          >
            <span style={styles.navIcon}>🔖</span>
            <span style={styles.navText}>Bookmarks</span>
          </div>
          <div 
            style={styles.navItem}
            onClick={handleSettingsClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.3)'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.querySelector('[style*="navIcon"]').style.transform = 'scale(1)'
            }}
          >
            <span style={styles.navIcon}>⚙️</span>
            <span style={styles.navText}>Settings</span>
          </div>
        </nav>
        <div 
          style={styles.profileSection} 
          onClick={handleProfileClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = '#333'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(29, 155, 240, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.2)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={styles.trendingTag}>#{item.tag}</div>
                <div style={styles.trendingPosts}>{item.count} posts</div>
              </div>
            ))
          )}
        </div>
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
      />
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#000000',
    animation: 'fadeIn 0.5s ease-out'
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
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '24px',
    cursor: 'pointer',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'transform 0.3s ease'
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
    gap: '14px',
    padding: '12px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid transparent',
    position: 'relative',
    overflow: 'hidden'
  },
  navIcon: {
    fontSize: '24px',
    color: '#ffffff',
    transition: 'transform 0.3s ease'
  },
  navText: {
    fontSize: '17px',
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: '-0.2px'
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '16px',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #333',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
  },
  profileAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
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
    backgroundColor: 'rgba(13, 13, 13, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #333',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    animation: 'slideIn 0.5s ease-out'
  },
  trendingTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '20px',
    letterSpacing: '-0.3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  trendingItem: {
    padding: '14px 12px',
    borderBottom: '1px solid #222',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid transparent',
    borderRadius: '12px',
    position: 'relative'
  },
  trendingTag: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
    letterSpacing: '-0.2px',
    transition: 'color 0.2s ease'
  },
  trendingPosts: {
    fontSize: '14px',
    color: '#888',
    fontWeight: '500',
    transition: 'color 0.2s ease'
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
