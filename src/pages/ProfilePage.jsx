import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { Link } from "react-router-dom"

function ProfilePage() {
  const { user } = useUser()
  const [myPosts, setMyPosts] = useState([])

  const fetchPosts = async () => {
    if (!user) return

    try {
      const res = await fetch("http://localhost:3001/api/posts")
      const data = await res.json()
      const userPosts = data.filter(post => post.userId === user.id)
      setMyPosts(userPosts)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [user])

  if (!user) return <div>Loading...</div>

  return (
    <div className="profile-page">
      <div className="container profile-container">
        <div className="profile-header">
          <img src={user.imageUrl} alt="Profile" className="profile-picture" />
          <div className="profile-info">
            <h1 className="profile-name">{user.fullName}</h1>
            <p className="profile-email">{user.primaryEmailAddress.emailAddress}</p>
            <p className="profile-bio">
              A passionate blogger who loves writing about tech and design.
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/editprofile" className="blog-card-link">
            Edit Profile
          </Link>
        </div>

        <div className="profile-posts">
          <h2 className="profile-posts-title">My Posts</h2>
          <div className="post-list">
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <div key={post.id} className="post-card">
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Blog Cover"
                      className="post-image"
                      style={{ width: "100%", height: "auto", borderRadius: "8px", marginBottom: "10px" }}
                    />
                  )}
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.content.slice(0, 100)}...</p>
                </div>
              ))
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/posts/new" className="blog-card-link">
            Create New Post
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
