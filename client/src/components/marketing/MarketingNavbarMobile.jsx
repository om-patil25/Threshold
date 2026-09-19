import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export const MarketingNavbarMobile = ({ isLoggedIn, onAdmin, onLogin, onSignUp }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center px-4">
      <header className="flex justify-between items-center px-6 py-4 w-full bg-white/90 backdrop-blur-md border border-t-0 border-brand-accent/20 rounded-b-2xl shadow-sm relative">
        <Link to="/" className="font-bold text-xl tracking-tighter text-brand-primary flex items-center gap-2">
          <img src="/logo.png" alt="Threshold Logo" className="w-6 h-6 object-contain" />
          Threshold
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu size={24} />
        </button>
        <div
          className={`absolute top-[98%] left-0 w-full bg-white shadow-xl border-brand-primary/10 rounded-b-2xl transition-all duration-300 ease-in-out z-[-1] grid ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100 border-t pointer-events-auto"
              : "grid-rows-[0fr] opacity-0 border-t-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-4 py-4 px-6">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (onAdmin) onAdmin();
                  }}
                  className="w-full py-2 font-bold bg-brand-accent text-white rounded-xl hover:bg-[#6D28D9] transition-colors"
                >
                  Admin
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onLogin) onLogin();
                    }}
                    className="w-full py-2 font-bold text-brand-primary hover:bg-black/5 rounded-xl transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onSignUp) onSignUp();
                    }}
                    className="w-full py-2 font-bold bg-brand-accent text-white rounded-xl hover:bg-[#6D28D9] transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
