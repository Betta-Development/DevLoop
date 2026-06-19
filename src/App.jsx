import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import Profile from './components/Profile'
import HashtagFeed from './components/HashtagFeed'
import Layout from './components/Layout'
import { useState, useEffect } from 'react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/home" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" />} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated ? <Layout><Home /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile/:userId" 
            element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/hashtag/:tag" 
            element={isAuthenticated ? <Layout><HashtagFeed /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={<Navigate to="/home" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
