import { useEffect, useState } from "react";
import { SignedOut, SignInButton } from "@clerk/clerk-react";

function WelcomePage() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch('http://localhost:3001/api/quote')
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const randomQuote = data[randomIndex];
          setQuote(`“${randomQuote.q}” — ${randomQuote.a}`);
        } else {
          setQuote("“Write what should not be forgotten.” — Isabel Allende");
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote("“Write what should not be forgotten.” — Isabel Allende");
      }
    }

    fetchQuote();
  }, []);

  return (
    <SignedOut>
      <div className="welcome-page">
        <h1 className="title">
          Welcome to Blog-It <img src="/logo.png" alt="Blog-It Logo" className="logo-img" />
        </h1>

        <p className="description">
          Dive into the cutest blogging space on the internet. Share your stories, explore others, and build your little corner of the web.
        </p>

        <SignInButton mode="modal">
          <button className="get-started-btn">Get Started</button>
        </SignInButton>

        <div className="quote-box">
          <p className="quote">{quote}</p>
        </div>
      </div>
    </SignedOut>
  );
}

export default WelcomePage;
