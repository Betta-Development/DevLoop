import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import EditProfile from './EditProfile'
import PostDetail from './PostDetail'
import './Profile.css'

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
    followers: [],
    following: [],
    verified: false,
    createdAt: new Date()
  })
  const [posts, setPosts] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [commentingPost, setCommentingPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [selectedPostId, setSelectedPostId] = useState(null)

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
        // Check if current user is following this user
        const currentUserData = JSON.parse(localStorage.getItem('user'))
        if (currentUserData && data.user.followers) {
          setIsFollowing(data.user.followers.some(f => f.toString() === currentUserData.id))
        }
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
    localStorage.setItem('user', JSON.stringify(updatedUser))
    fetchUserPosts()
  }

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/auth/follow/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
        setUser(prev => ({
          ...prev,
          followersCount: data.followersCount
        }))
        // Update current user's following count in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'))
        if (currentUser) {
          currentUser.followingCount = data.followingCount
          localStorage.setItem('user', JSON.stringify(currentUser))
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    }
  }

  const handleBackClick = () => {
    navigate('/home')
  }

  const handleLike = async (postId) => {
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
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: data.likes }
            : post
        ))
        
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

  const handleRepost = async (postId) => {
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
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, retweets: data.retweets }
            : post
        ))
        fetchUserPosts()
      }
    } catch (error) {
      console.error('Error reposting:', error)
    }
  }

  const handleCommentClick = (postId) => {
    setCommentingPost(commentingPost === postId ? null : postId)
    setCommentText('')
  }

  const handleCommentSubmit = async (postId) => {
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
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, comments: data.comments }
            : post
        ))
        setCommentText('')
        setCommentingPost(null)
      }
    } catch (error) {
      console.error('Error commenting:', error)
    }
  }

  const handlePostClick = (postId) => {
    setSelectedPostId(postId)
  }

  return (
    <>
      <div className="profile-header">
        <button onClick={handleBackClick} className="profile-back-button">← Back</button>
        <div className="profile-header-title">Profile</div>
      </div>

      <div className="profile-section">
        <div className="profile-cover-photo">
          {user.banner ? (
            <img src={user.banner} alt="Banner" className="profile-banner-image" />
          ) : null}
        </div>
        <div className="profile-content">
          <div className="profile-avatar-section">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="profile-avatar-image" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-details">
            <div className="profile-header-row">
              <h1 className="profile-username">{user.username}</h1>
              {isOwnProfile ? (
                <button onClick={handleEditProfile} className="profile-edit-button">Edit Profile</button>
              ) : (
                <button 
                  onClick={handleFollow}
                  className={isFollowing ? 'profile-unfollow-button' : 'profile-follow-button'}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            <div className="profile-user-handle">@{user.username.toLowerCase()}</div>
            {user.pronouns && <div className="profile-pronouns">{user.pronouns}</div>}
            {user.location && <div className="profile-location">📍 {user.location}</div>}
            {user.bio && <p className="profile-bio">"{user.bio}"</p>}
            
            <div className="profile-follow-stats">
              <span className="profile-follow-stat"><strong>{user.followers?.length || 0}</strong> Followers</span>
              <span className="profile-follow-stat"><strong>{user.following?.length || 0}</strong> Following</span>
            </div>
            
            <div className="profile-meta-info">
              <span className="profile-meta-item">📅 Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>

            {(user.website || user.github || user.linkedin || user.twitter) && (
              <div className="profile-social-links">
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                    🔗 {user.website}
                  </a>
                )}
                {user.github && (
                  <a href={`https://${user.github}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                    💻 {user.github}
                  </a>
                )}
                {user.linkedin && (
                  <a href={`https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                    💼 {user.linkedin}
                  </a>
                )}
                {user.twitter && (
                  <a href={`https://${user.twitter}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                    🐦 {user.twitter}
                  </a>
                )}
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="profile-skills-section">
                <h3 className="profile-skills-title">Skills</h3>
                <div className="profile-skills-list">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="profile-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-posts-section">
        <h2 className="profile-posts-title">Posts</h2>
        {posts.length === 0 ? (
          <div className="profile-no-posts">
            <p className="profile-no-posts-text">No posts yet</p>
            <p className="profile-no-posts-subtext">When you post, they'll show up here</p>
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post._id} 
              className="profile-post"
              onClick={() => handlePostClick(post._id)}
            >
              <div className="profile-post-avatar">
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt="Profile" className="profile-post-avatar-image" />
                ) : (
                  <div className="profile-post-avatar-placeholder">{post.authorName.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="profile-post-content">
                <div className="profile-post-header">
                  <span className="profile-post-author">{post.authorName}</span>
                  <span className="profile-post-handle">{post.authorHandle}</span>
                  <span className="profile-post-time">{post.timeAgo}</span>
                </div>
                <p className="profile-post-text">{post.content}</p>
                <div className="profile-post-actions">
                  <span 
                    className="profile-post-action profile-post-action-comment"
                    onClick={() => handleCommentClick(post._id)}
                  >💬 <span className="profile-action-count">{post.comments || 0}</span></span>
                  <span 
                    className="profile-post-action profile-post-action-retweet"
                    onClick={() => handleRepost(post._id)}
                  >🔄 <span className="profile-action-count">{post.retweets || 0}</span></span>
                  <span 
                    className={`profile-post-action profile-post-action-like ${likedPosts.has(post._id) ? 'profile-post-liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >❤️ <span className="profile-action-count">{post.likes || 0}</span></span>
                  <span className="profile-post-action profile-post-action-share">🔗</span>
                </div>
                {commentingPost === post._id && (
                  <div className="profile-comment-section">
                    <textarea
                      className="profile-comment-input"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={2}
                    />
                    <div className="profile-comment-actions">
                      <button
                        className="profile-comment-cancel-button"
                        onClick={() => {
                          setCommentingPost(null)
                          setCommentText('')
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="profile-comment-submit-button"
                        onClick={() => handleCommentSubmit(post._id)}
                        disabled={!commentText.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
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

      <PostDetail
        isOpen={selectedPostId !== null}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId}
        user={currentUser}
      />
    </>
  )
}


export default Profile
