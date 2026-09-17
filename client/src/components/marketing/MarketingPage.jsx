import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getAdminUser();
        if (res && res.user) {
          navigate("/admin");
        } else {
          setIsCheckingAuth(false);
        }
      } catch (err) {
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
    />
  );
};
