import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import PostPage from "./pages/PostPage"
import NewPostPage from "./pages/NewPostPage"
import EditPostPage from "./pages/EditPostPage"
import ExplorePage from "./pages/ExplorePage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from './pages/NotFoundPage'
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import WelcomePage from "./pages/WelcomePage"
import { useUser } from "@clerk/clerk-react"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import "./App.css"
import EditProfilePage from "./pages/EditProfilePage"

// ProtectedRoute for wrapping components that need user authentication
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function App() {
  const { user } = useUser()
  console.log(user?.id, user?.emailAddresses[0]?.emailAddress)

  return (
    <div className="app">
      <Header />
      <div className="page-wrapper">
        <main className="container">
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <WelcomePage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/posts/new" element={
              <ProtectedRoute>
                <NewPostPage />
              </ProtectedRoute>
            } />
            <Route path="/posts/edit/:id" element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            } />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/notfound" element={<NotFoundPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/editprofile" element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
