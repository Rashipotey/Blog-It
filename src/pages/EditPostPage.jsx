"use client"

import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/clerk-react"
import PostForm from "../components/PostForm"
import { useNavigate, useParams } from "react-router-dom"

function EditPostPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const { postId } = useParams()  
  const [post, setPost] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState(null) // To store the Cloudinary image URL
  const navigate = useNavigate()

  // Fetch the post details on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${postId}`)
        if (!response.ok) throw new Error("Failed to fetch post")
        const data = await response.json()
        setPost(data)
        setImageUrl(data.imageUrl) // Set the initial image URL if exists
      } catch (error) {
        console.error("Error fetching post:", error)
      }
    }
    fetchPost()
  }, [postId])

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET") // Replace with your Cloudinary preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.secure_url) {
        setImageUrl(data.secure_url) // Set the Cloudinary URL for the image
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    }
  }

  const handleEditPost = async (formData) => {
    if (!user) return alert("You must be logged in to edit a post.")
    setIsSubmitting(true)

    // Append the Cloudinary image URL if it's been uploaded
    const updatedPostData = {
      ...formData,
      imageUrl: imageUrl || post.imageUrl, // Use the existing image URL if none uploaded
    }

    try {
      const token = await getToken()
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPostData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to update post")
      const updatedPost = await response.json()
      navigate("/") // Navigate to the homepage or the post page
    } catch (error) {
      console.error("Error updating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="edit-post-page">
      <h1>Edit Post</h1>
      {post && (
        <PostForm
          onSubmit={handleEditPost}
          isSubmitting={isSubmitting}
          initialValues={post}
        />
      )}
      <div>
        <label className="block text-sm font-medium">Post Image</label>
        <input
          type="file"
          className="form-input w-full"
          onChange={handleImageUpload}
          accept="image/*"
        />
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Post Image" className="w-32 h-32 object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditPostPage
