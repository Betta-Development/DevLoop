import { useState, useEffect, useRef } from 'react'
import './EditProfile.css'

function EditProfile({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    bio: '',
    pronouns: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    location: '',
    avatar: '',
    banner: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const avatarInputRef = useRef(null)
  const bannerInputRef = useRef(null)
  const [avatarHover, setAvatarHover] = useState(false)
  const [bannerHover, setBannerHover] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        pronouns: user.pronouns || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        location: user.location || '',
        avatar: user.avatar || '',
        banner: user.banner || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          banner: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    avatarInputRef.current?.click()
  }

  const handleBannerClick = () => {
    bannerInputRef.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: formData.bio,
          pronouns: formData.pronouns,
          website: formData.website,
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          location: formData.location,
          avatar: formData.avatar,
          banner: formData.banner
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      onSave(data.user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal">
        <div className="edit-profile-header">
          <h2 className="edit-profile-title">Edit Profile</h2>
          <button onClick={onClose} className="edit-profile-close-button">✕</button>
        </div>

        <div className="edit-profile-content">
          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="edit-profile-section">
              <h3 className="edit-profile-section-title">Profile Picture</h3>
              <div 
                className={`edit-profile-avatar-preview ${avatarHover ? 'edit-profile-avatar-hover' : ''}`}
                onClick={handleAvatarClick}
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Preview" className="edit-profile-preview-image" />
                ) : (
                  <div className="edit-profile-preview-placeholder">
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="edit-profile-camera-overlay">
                  <span className="edit-profile-camera-icon">📷</span>
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                name="avatarFile"
                accept="image/*"
                onChange={handleFileChange}
                className="edit-profile-hidden-input"
              />
            </div>

            <div className="edit-profile-section">
              <h3 className="edit-profile-section-title">Banner Image</h3>
              <div 
                className={`edit-profile-banner-preview ${bannerHover ? 'edit-profile-banner-hover' : ''}`}
                onClick={handleBannerClick}
                onMouseEnter={() => setBannerHover(true)}
                onMouseLeave={() => setBannerHover(false)}
              >
                {formData.banner ? (
                  <img src={formData.banner} alt="Banner" className="edit-profile-banner-image" />
                ) : (
                  <div className="edit-profile-banner-placeholder">
                    <span className="edit-profile-banner-placeholder-text">No banner</span>
                  </div>
                )}
                <div className="edit-profile-camera-overlay">
                  <span className="edit-profile-camera-icon">📷</span>
                </div>
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                name="bannerFile"
                accept="image/*"
                onChange={handleBannerChange}
                className="edit-profile-hidden-input"
              />
            </div>

            <div className="edit-profile-section">
              <h3 className="edit-profile-section-title">Basic Info</h3>
              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="edit-profile-textarea"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={500}
                />\n                <div className="edit-profile-char-count">{formData.bio.length}/500</div>
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Pronouns</label>
                <input
                  type="text"
                  name="pronouns"
                  value={formData.pronouns}
                  onChange={handleChange}
                  className="edit-profile-input"
                  placeholder="they/them, she/her, he/him"
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="edit-profile-input"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="edit-profile-section">
              <h3 className="edit-profile-section-title">Social Links</h3>
              <div className="edit-profile-form-group">
                <label className="edit-profile-label">🌐 Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="edit-profile-input"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">💻 GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="edit-profile-input"
                  placeholder="github.com/username"
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">💼 LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="edit-profile-input"
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">🐦 Twitter/X</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="edit-profile-input"
                  placeholder="twitter.com/username"
                />
              </div>
            </div>

            {error && <p className="edit-profile-error">{error}</p>}

            <div className="edit-profile-actions">
              <button
                type="button"
                onClick={onClose}
                className="edit-profile-cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="edit-profile-save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


export default EditProfile
