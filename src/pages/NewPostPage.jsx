"use client"
import { useState } from "react"
import { useUser, useAuth } from "@clerk/clerk-react"
import PostForm from "../components/PostForm"
import { useNavigate } from "react-router-dom"

function NewPostPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePost = async (formData) => {
    setIsSubmitting(true);

    try {
      const { image } = formData; 
      let cloudinaryImageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "your_cloudinary_preset"); 

        const cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
          method: "POST",
          body: formData,
        });

        const cloudinaryData = await cloudinaryResponse.json();

        if (!cloudinaryResponse.ok) throw new Error("Failed to upload image to Cloudinary");

        cloudinaryImageUrl = cloudinaryData.secure_url; 
      }

      const token = await getToken();
      const postData = { 
        ...formData,
        image: cloudinaryImageUrl,  
      };

      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const newPost = await response.json();
      navigate(`/posts/${newPost.id}`);

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
      console.log("Form submission complete");
    }
  };

  return (
    <div className="new-post-page">
      <h1>Create New Post</h1> 
      <PostForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
    </div>
  )
}

export default NewPostPage
