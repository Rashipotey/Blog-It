import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"

function EditProfilePage() {
  const navigate = useNavigate()
  const { user } = useUser()

  const [name, setName] = useState(user?.fullName || "")
  const [username, setUsername] = useState(user?.username || "")
  const [bio, setBio] = useState(user?.publicMetadata?.bio || "")
  const [profileImage, setProfileImage] = useState(user?.profileImage || "")
  const [isSaving, setIsSaving] = useState(false)

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
        setProfileImage(data.secure_url) // Store the Cloudinary image URL
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await user.update({
        username,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        publicMetadata: { bio },
        profileImage, // Include the Cloudinary image URL
      })
      alert("Profile updated!")
      navigate("/") 
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="edit-profile-page max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="form-input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            className="form-input w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            className="form-textarea w-full"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            type="file"
            className="form-input w-full"
            onChange={handleImageUpload}
            accept="image/*"
          />
          {profileImage && (
            <div className="mt-4">
              <img src={profileImage} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}

export default EditProfilePage
