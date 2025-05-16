import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function ExplorePage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("http://localhost:3001/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to fetch posts:", err))
  }, [])

  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore Posts</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content.slice(0, 150)}...</p>
            <p className="post-author"><strong>By:</strong> {post.author}</p>
            <Link to={`/posts/${post.id}`} className="read-more-link">Read more</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExplorePage
