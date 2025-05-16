import { useState } from "react"

function PostForm({ onSubmit, isSubmitting, initialValues = {} }) {
  const [title, setTitle] = useState(initialValues.title || "")
  const [content, setContent] = useState(initialValues.content || "")
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!content.trim()) newErrors.content = "Content is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    console.log("Form submitted"); 
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
  
    await onSubmit(formData);
  };  

  return (
    <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`form-input ${errors.title ? "form-input-error" : ""}`}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Header Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="form-input"
        />
      </div>


      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className={`form-textarea ${errors.content ? "form-textarea-error" : ""}`}
        />
        {errors.content && <p className="form-error">{errors.content}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-block">
      {isSubmitting ? (
        <>
          <span className="loading-spinner-small"></span>
          {initialValues.title ? "Updating..." : "Creating..."}
        </>
      ) : (
        <>{initialValues.title ? "Update Post" : "Create Post"}</>
      )}
    </button>
    </form>
  )
}

export default PostForm
