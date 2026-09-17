import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Input } from "../shared/Input";
import {
  loginUser,
  registerNewUser,
  checkUserNameAvailibility,
} from "../../service/userServices";
import { toast } from "../../utils/toast";

export const AuthForms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialIsLogin = searchParams.get("mode") !== "signup";
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If the URL changes, update internal state
    setIsLogin(searchParams.get("mode") !== "signup");
  }, [searchParams]);

  useEffect(() => {
    // Load username from localStorage if signing up
    if (!isLogin) {
      const stored = localStorage.getItem("threshold_username");
      if (stored) {
        setUsername(stored);
      }
    }
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      setUsernameAvailable(null);
      return;
    }
    const checkUser = async () => {
      if (username.trim().length < 1) {
        setUsernameAvailable(null);
        return;
      }
      setCheckingUsername(true);
      try {
        const { available } = await checkUserNameAvailibility(username);
        setUsernameAvailable(available);
      } catch (err) {
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };
    const debounce = setTimeout(checkUser, 500);
    return () => clearTimeout(debounce);
  }, [username, isLogin]);

  const toggleMode = () => {
    const newMode = isLogin ? "signup" : "login";
    setSearchParams({ mode: newMode });
  };

  const validate = () => {
    const newErrors = {};
    if (!isLogin) {
      if (name.trim().length < 3)
        newErrors.name = "Name must be at least 3 characters";
      if (username.trim().length < 3)
        newErrors.username = "Username must be at least 3 characters";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      newErrors.email = "Please enter a valid email address";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!isLogin && usernameAvailable === false)
      newErrors.username = "Username is already taken";

    setErrors(newErrors);
    setApiError("");
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (!isLogin) {
        await registerNewUser({ name, username, email, password });
        localStorage.removeItem("threshold_username");
        toast("Account created successfully!");
        navigate(`/onboarding`);
      } else {
        await loginUser({ email, password });
        toast("Logged in successfully!");
        navigate(`/admin`);
      }
    } catch (err) {
      const errorMsg = err.message || "Authentication failed.";
      setApiError(errorMsg);
      toast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 font-sans text-text-primary">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="font-bold text-3xl tracking-tighter text-brand-primary flex items-center gap-2 mb-10">
          <img
            src="/logo.png"
            alt="Threshold Logo"
            className="w-10 h-10 object-contain"
          />
          Threshold
        </div>

        <Card className="w-full p-8 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-brand-primary mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-text-primary/70 text-sm">
              {isLogin
                ? "Enter your details to access your dashboard"
                : "Start building your professional presence"}
            </p>
          </div>

          {apiError && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-200">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleAuth}>
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  error={errors.name}
                />
                <div className="w-full flex flex-col">
                  <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => {
                      setUsername(
                        e.target.value.toLowerCase().replace(/\s/g, ""),
                      );
                      if (errors.username)
                        setErrors({ ...errors, username: null });
                    }}
                    error={
                      errors.username ||
                      (usernameAvailable === false && !checkingUsername
                        ? "Username is already taken"
                        : null)
                    }
                  />
                  {!errors.username &&
                    usernameAvailable === true &&
                    !checkingUsername && (
                      <span className="text-xs font-semibold text-green-500 mt-1 pl-1">
                        Username is available!
                      </span>
                    )}
                  {!errors.username && checkingUsername && (
                    <span className="text-xs font-semibold text-brand-primary/50 mt-1 pl-1">
                      Checking...
                    </span>
                  )}
                </div>
              </>
            )}
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="you@example.com"
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              placeholder="••••••••"
              error={errors.password}
            />
            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: null });
                }}
                placeholder="••••••••"
                error={errors.confirmPassword}
              />
            )}

            <Button variant="accent" className="w-full mt-2" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm text-text-primary/70 mt-2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="font-bold text-brand-accent hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
