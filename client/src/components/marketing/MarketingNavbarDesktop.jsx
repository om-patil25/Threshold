import React from "react";
import { Link } from "react-router-dom";

export const MarketingNavbarDesktop = ({ isLoggedIn, onAdmin, onLogin, onSignUp }) => (
  <div className="fixed top-0 left-0 w-full z-50 flex justify-center px-4">
    <header className="flex justify-between items-center px-8 py-4 max-w-5xl w-full bg-white/80 backdrop-blur-md border border-t-0 border-brand-accent/20 rounded-b-2xl shadow-sm">
      <Link to="/" className="font-bold text-2xl tracking-tighter text-brand-primary flex items-center gap-2">
        <img src="/logo.png" alt="Threshold Logo" className="w-8 h-8 object-contain" />
        Threshold
      </Link>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <button
            onClick={onAdmin}
            className="px-6 py-2 font-bold bg-brand-accent text-white rounded-full hover:bg-[#6D28D9] transition-colors"
          >
            Admin
          </button>
        ) : (
          <>
            <button
              onClick={onLogin}
              className="px-4 py-2 font-bold text-brand-primary hover:bg-black/5 rounded-full transition-colors"
            >
              Login
            </button>
            <button
              onClick={onSignUp}
              className="px-6 py-2 font-bold bg-brand-accent text-white rounded-full hover:bg-[#6D28D9] transition-colors"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  </div>
);
