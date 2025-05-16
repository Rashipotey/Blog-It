import { Link } from "react-router-dom"

function BlogList({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h2 className="empty-state-title">No posts yet</h2>
        <p className="empty-state-description">Create your first blog post to get started.</p>
        <Link to="/posts/new" className="btn btn-primary">
          Create New Post
        </Link>
      </div>
    )
  }

  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <div key={post.id} className="blog-card">
          <div className="blog-card-header">
            <h2 className="blog-card-title">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
          </div>
          <div className="blog-card-content">
            <p className="blog-card-excerpt">{post.content.substring(0, 150)}...</p>
          </div>
          <div className="blog-card-footer">
            <time className="blog-card-date" dateTime={post.date}>
              {post.date}
            </time>
            <Link to={`/posts/${post.id}`} className="blog-card-link">
              Read more
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogList
