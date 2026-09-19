import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code, Layers, EyeOff } from "lucide-react";
import { FadeInSection } from "../shared/FadeInSection";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { MarketingDesktop } from "./MarketingDesktop";
import { MarketingMobile } from "./MarketingMobile";
import {
  checkUserNameAvailibility,
  getAdminUser,
} from "../../service/userServices";

export const MarketingPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getAdminUser();
        if (res && res.user) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        // Not logged in
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleCheckUsername = async (username) => {
    if (!username || username.trim() === "") {
      setIsUsernameAvailable(null);
      return;
    }
    try {
      const { available } = await checkUserNameAvailibility(username);
      setIsUsernameAvailable(available);
    } catch (err) {
      // Ignore or toast
    }
  };

  const handleStart = (username) => {
    if (username) {
      localStorage.setItem("threshold_username", username);
    }
    navigate("/auth?mode=signup");
  };

  const handleLogin = () => {
    navigate("/auth?mode=login");
  };

  const handleSignUp = () => {
    navigate("/auth?mode=signup");
  };

  const handleAdmin = () => {
    navigate("/admin");
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-bg-primary" />;
  }

  if (isMobile) {
    return (
      <MarketingMobile
        onCheckUsername={handleCheckUsername}
        isUsernameAvailable={isUsernameAvailable}
        onStart={handleStart}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onAdmin={handleAdmin}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return (
    <MarketingDesktop
      onCheckUsername={handleCheckUsername}
      isUsernameAvailable={isUsernameAvailable}
      onStart={handleStart}
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      onAdmin={handleAdmin}
      isLoggedIn={isLoggedIn}
    />
  );
};

export const MarketingBenefits = () => (
  <section className="py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto">
    <FadeInSection className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4 md:mb-6">
          <EyeOff size={32} />
        </div>
        <h3 className="text-2xl font-bold text-brand-primary mb-3 md:mb-4">
          No clutter, ever
        </h3>
        <p className="text-brand-primary">
          Empty sections just disappear. Your page only ever shows what you've
          actually filled in.
        </p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4 md:mb-6">
          <Code size={32} />
        </div>
        <h3 className="text-2xl font-bold text-brand-primary mb-3 md:mb-4">
          Built to look like real work
        </h3>
        <p className="text-brand-primary">
          Featured projects get real visual space, not squeezed into a link row.
        </p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4 md:mb-6">
          <Layers size={32} />
        </div>
        <h3 className="text-2xl font-bold text-brand-primary mb-3 md:mb-4">
          Completely free
        </h3>
        <p className="text-brand-primary">
          No paywalled features, no premium tier. Just build your page.
        </p>
      </div>
    </FadeInSection>
  </section>
);

export const MarketingHelpCTA = () => (
  <FadeInSection className="py-12 px-6 md:px-12 max-w-2xl mx-auto border-t border-brand-primary/10 flex flex-col items-center gap-4 text-center mt-8 md:mt-12">
    <h3 className="font-bold text-brand-primary text-xl">Have a question?</h3>
    <p className="text-brand-primary text-sm max-w-md mx-auto">
      Getting started takes about two minutes. Still have questions? Check our
      FAQ or reach out to support.
    </p>
    <a
      href="/help"
      className="px-6 py-2 mt-2 font-bold bg-brand-primary/5 text-brand-primary rounded-full hover:bg-brand-primary/10 transition-colors"
    >
      Visit our Help Center
    </a>
  </FadeInSection>
);

export const MarketingDeveloper = () => (
  <FadeInSection className="py-12 px-6 md:px-12 max-w-2xl mx-auto border-t border-brand-primary/10 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center text-center md:text-left">
    <div className="w-16 h-16 rounded-full bg-brand-accent/20 shrink-0 flex items-center justify-center font-bold text-brand-accent mb-0">
      OP
    </div>
    <div>
      <h2 className="font-bold text-brand-primary text-lg">
        Built by Om Patil
      </h2>
      <p className="text-brand-primary text-sm mb-4 md:mb-3">
        Learning full-stack development, one real project at a time.{" "}
        <span className="text-brand-accent">Threshold</span> is my proof of work
        — built end to end, from the database up.
      </p>
      <div className="flex gap-4 justify-center md:justify-start text-sm text-brand-accent font-medium">
        <a
          href="https://github.com/om-patil25"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          GitHub
        </a>
        <span>·</span>
        <a
          href="https://www.linkedin.com/in/om-patil25/"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          LinkedIn
        </a>
        <span>·</span>
        <a
          href="https://thrshld.in/om-patil25"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          My Threshold
        </a>
      </div>
    </div>
  </FadeInSection>
);

export const MarketingFooter = () => (
  <footer className="py-8 text-center text-sm text-brand-primary font-medium">
    &copy; {new Date().getFullYear()} Threshold Platform. All rights reserved.
  </footer>
);
