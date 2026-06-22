import { useState } from 'react'
import './Settings.css'

function Settings({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState('account')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password')
      }

      setSuccess('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    )

    if (!confirmed) return

    const doubleConfirmed = window.confirm(
      'This is your last chance. Are you absolutely sure you want to delete your account?'
    )

    if (!doubleConfirmed) return

    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account')
      }

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button onClick={onClose} className="settings-close-button">✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={`settings-tab ${activeTab === 'account' ? 'settings-tab-active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button
              className={`settings-tab ${activeTab === 'security' ? 'settings-tab-active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button
              className={`settings-tab ${activeTab === 'danger' ? 'settings-tab-active' : ''}`}
              onClick={() => setActiveTab('danger')}
            >
              Danger Zone
            </button>
          </div>

          <div className="settings-tab-content">
            {activeTab === 'account' && (
              <div className="settings-section">
                <h3 className="settings-section-title">Account Information</h3>
                <div className="settings-info-group">
                  <label className="settings-label">Username</label>
                  <div className="settings-info-value">{user?.username || 'N/A'}</div>
                </div>
                <div className="settings-info-group">
                  <label className="settings-label">Email</label>
                  <div className="settings-info-value">{user?.email || 'N/A'}</div>
                </div>
                <div className="settings-info-group">
                  <label className="settings-label">Account Created</label>
                  <div className="settings-info-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
                <div className="settings-info-group">
                  <label className="settings-label">Account Status</label>
                  <div className="settings-info-value">
                    {user?.verified ? (
                      <span className="settings-status-verified">✓ Verified</span>
                    ) : (
                      <span className="settings-status-unverified">✗ Unverified</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h3 className="settings-section-title">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="settings-form-group">
                    <label className="settings-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="settings-input"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="settings-input"
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="settings-input"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  {error && <p className="settings-error">{error}</p>}
                  {success && <p className="settings-success">{success}</p>}
                  <button
                    type="submit"
                    className="settings-submit-button"
                    disabled={loading}
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="settings-section settings-danger-zone">
                <h3 className="settings-section-title">Danger Zone</h3>
                <p className="settings-warning-text">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="settings-danger-actions">
                  <button
                    onClick={handleDeleteAccount}
                    className="settings-delete-button"
                    disabled={loading}
                  >
                    {loading ? 'Deleting Account...' : 'Delete Account'}
                  </button>
                </div>
                {error && <p className="settings-error">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
