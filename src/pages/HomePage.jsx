"use client"

import { useState, useEffect } from "react"
import BlogList from "../components/BlogList"
import { useUser, useAuth } from "@clerk/clerk-react"

function HomePage() {
  const { user } = useUser()
  const { getToken } = useAuth()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch posts from the server
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(data) // Assuming the posts contain Cloudinary image URLs
    } catch (err) {
      setError("Posts Not Found. Write your first post!")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Render loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  // Render error message
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <h1>Your Posts</h1>
      {/* Display posts for the logged-in user */}
      <BlogList 
        posts={posts.filter(post => post.userId === user?.id)} 
        setPosts={setPosts} 
      />
    </div>
  )
}

export default HomePage
