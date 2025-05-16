import { Link, useLocation } from "react-router-dom"
import {SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, } from "@clerk/clerk-react"

function Header() {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Blog-It Logo" className="logo-img" />
          <span>Blog-It</span>
        </Link>

        <div className="header-actions">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary">Login / Sign Up</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link to="/" className="btn btn-primary">
              Home
            </Link>

            <Link to="/explore" className="btn btn-primary">
              Explore
            </Link>

            <Link to="/posts/new" className="btn btn-primary">
              Write
            </Link>

            <Link to="/profile" className="btn btn-primary">
              Profile
            </Link>

            <SignOutButton>
              <button className="btn btn-danger logout-btn">Logout</button>
            </SignOutButton>

            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export default Header
