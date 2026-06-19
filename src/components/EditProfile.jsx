import { useState, useEffect, useRef } from 'react'

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
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Profile</h2>
          <button 
            onClick={onClose} 
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.transform = 'rotate(90deg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'rotate(0deg)'
            }}
          >✕</button>
        </div>

        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Profile Picture</h3>
              <div 
                style={styles.avatarPreview} 
                onClick={handleAvatarClick}
                onMouseEnter={(e) => {
                  setAvatarHover(true)
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.5)'
                }}
                onMouseLeave={(e) => {
                  setAvatarHover(false)
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = '#333'
                }}
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Preview" style={styles.previewImage} />
                ) : (
                  <div style={styles.previewPlaceholder}>
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div style={{...styles.cameraOverlay, opacity: avatarHover ? 1 : 0}}>
                  <span style={styles.cameraIcon}>📷</span>
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                name="avatarFile"
                accept="image/*"
                onChange={handleFileChange}
                style={styles.hiddenInput}
              />
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Banner Image</h3>
              <div 
                style={styles.bannerPreview} 
                onClick={handleBannerClick}
                onMouseEnter={(e) => {
                  setBannerHover(true)
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.5)'
                }}
                onMouseLeave={(e) => {
                  setBannerHover(false)
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = '#333'
                }}
              >
                {formData.banner ? (
                  <img src={formData.banner} alt="Banner" style={styles.bannerImage} />
                ) : (
                  <div style={styles.bannerPlaceholder}>
                    <span style={styles.bannerPlaceholderText}>No banner</span>
                  </div>
                )}
                <div style={{...styles.cameraOverlay, opacity: bannerHover ? 1 : 0}}>
                  <span style={styles.cameraIcon}>📷</span>
                </div>
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                name="bannerFile"
                accept="image/*"
                onChange={handleBannerChange}
                style={styles.hiddenInput}
              />
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Basic Info</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={500}
                />
                <div style={styles.charCount}>{formData.bio.length}/500</div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Pronouns</label>
                <input
                  type="text"
                  name="pronouns"
                  value={formData.pronouns}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="they/them, she/her, he/him"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Social Links</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>🌐 Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>💻 GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="github.com/username"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>💼 LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>🐦 Twitter/X</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="twitter.com/username"
                />
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.actions}>
              <button
                type="button"
                onClick={onClose}
                style={styles.cancelButton}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(29, 155, 240, 0.5)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#333'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.saveButton}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 255, 255, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)'
                }}
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

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },
  modal: {
    backgroundColor: '#000000',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'hidden',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
    animation: 'scaleIn 0.3s ease-out'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid #333',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.3px'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s ease',
    borderRadius: '8px'
  },
  content: {
    overflowY: 'auto',
    padding: '32px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '24px',
    borderBottom: '1px solid #333'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0
  },
  avatarPreview: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    border: '3px solid #333',
    alignSelf: 'flex-start',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: '#1a1a1a'
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  bannerPreview: {
    width: '100%',
    height: '130px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    border: '2px solid #333',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a'
  },
  bannerPlaceholderText: {
    color: '#888',
    fontSize: '14px'
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s'
  },
  cameraIcon: {
    fontSize: '32px',
    color: '#ffffff'
  },
  hiddenInput: {
    display: 'none'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff'
  },
  input: {
    padding: '14px 18px',
    backgroundColor: '#16181c',
    border: '1px solid #333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  fileInput: {
    padding: '12px 16px',
    backgroundColor: '#16181c',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer'
  },
  orDivider: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    margin: '4px 0'
  },
  textarea: {
    padding: '14px 18px',
    backgroundColor: '#16181c',
    border: '1px solid #333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  },
  charCount: {
    fontSize: '12px',
    color: '#888',
    textAlign: 'right'
  },
  error: {
    color: '#f4212e',
    fontSize: '14px',
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'transparent',
    border: '1px solid #333',
    borderRadius: '24px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  saveButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '24px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
  }
}

export default EditProfile
