"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DeletePostDialog from "../components/DeletePostDialog"

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch post")
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError("Failed to load blog post. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(`/posts/edit/${post.id}`)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <div className="error-message">{error || "Post not found"}</div>
      </div>
    )
  }

  return (
    <div className="post-page">
      <div className="post-actions">
        <button className="btn btn-back" onClick={handleBack}>
          <i className="icon-arrow-left"></i> Back to Posts
        </button>
        <div className="post-actions-right">
          <button className="btn btn-edit" onClick={handleEdit}>
            <i className="icon-edit"></i> Edit
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            <i className="icon-trash"></i> Delete
          </button>
        </div>
      </div>

      <article className="post-content">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
        <div className="post-body">{post.content}</div>
      </article>

      {showDeleteDialog && (
        <DeletePostDialog
          postId={post.id}
          postTitle={post.title}
          onClose={() => setShowDeleteDialog(false)}
          onDeleted={() => navigate("/")}
        />
      )}
    </div>
  )
}

export default PostPage
