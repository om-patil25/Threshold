import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Code, Layers, EyeOff } from "lucide-react";
import { FadeInSection } from "../shared/FadeInSection";
import { fetchPublicUser } from "../../service/userServices";
import { PublicProfileDesktop } from "../publicProfile/PublicProfileDesktop";
import { PublicProfileMobile } from "../publicProfile/PublicProfileMobile";
import { Loader } from "../shared/Loader";

const DYNAMIC_WORDS = ["portfolio", "storefront", "link in bio"];

export const MarketingDesktop = ({
  onCheckUsername,
  isUsernameAvailable,
  onStart,
  onLogin,
  onSignUp,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchPublicUser("mockpriya");
        setProfileData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
        setFade(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    if (onCheckUsername) onCheckUsername(val);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-brand-primary flex flex-col font-sans">
      {/* Top bar (Notch) */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center px-4">
        <header className="flex justify-between items-center px-8 py-4 max-w-5xl w-full bg-white/80 backdrop-blur-md border border-t-0 border-brand-accent/20 rounded-b-2xl shadow-sm">
          <div className="font-bold text-2xl tracking-tighter text-brand-primary flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center">
              T
            </div>
            Threshold
          </div>
          <div className="flex gap-4">
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
          </div>
        </header>
      </div>

      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 min-h-150 flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
              alt="Desk"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm"></div>
          </div>

          <FadeInSection className="relative z-10 max-w-5xl mx-auto px-12 text-center w-full">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-brand-primary mb-6">
              Your work. Your links.
              <br />
              Your{" "}
              <span className="text-brand-accent relative inline-block min-w-70">
                <span
                  className={`inline-block transition-opacity duration-500 ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}
                >
                  {DYNAMIC_WORDS[wordIndex]}
                </span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-brand-accent/20 -z-10"></span>
              </span>
            </h1>
            <p className="text-xl text-brand-primary/70 mb-12 max-w-2xl mx-auto">
              One page that's whatever you need it to be — free, for anyone who
              wants a real presence online.
            </p>

            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="flex bg-white border-2 border-brand-accent rounded-full p-1 w-full shadow-lg relative">
                <div className="flex items-center pl-6 text-brand-primary/50 font-medium select-none">
                  threshold.me/
                </div>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="grow bg-transparent outline-none px-2 text-brand-accent font-medium placeholder:text-brand-primary/30"
                />
                <button
                  className="rounded-full px-8 py-3 bg-brand-accent text-white font-bold hover:bg-[#6D28D9] transition-colors"
                  onClick={() => onStart && onStart(username)}
                >
                  Start
                </button>
              </div>
              {username && isUsernameAvailable !== null && (
                <div
                  className={`mt-3 text-sm font-bold ${isUsernameAvailable ? "text-green-500" : "text-red-500"}`}
                >
                  {isUsernameAvailable
                    ? "✓ Username is available"
                    : "✗ Username is taken"}
                </div>
              )}
            </div>
          </FadeInSection>
        </section>

        {/* Make Your Presence Section */}
        <section className="bg-white text-brand-primary py-32 px-12 border-y border-brand-primary/5">
          <FadeInSection className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-5xl font-bold mb-6 text-brand-accent">
                Make Your Presence
              </h2>
              <p className="text-xl text-brand-primary/80 mb-8 leading-relaxed">
                Two real, separately-designed layouts — a horizontal desktop
                experience and a vertical mobile view. Not one responsive
                template reflowed between breakpoints.
              </p>
            </div>
            <div className="flex-1 flex items-end justify-center relative w-full h-[350px]">
              {/* Desktop mockup */}
              <div className="absolute right-12 bottom-0 w-[450px] h-[280px] bg-bg-primary rounded-t-xl border-t-8 border-x-8 border-brand-accent shadow-2xl overflow-hidden flex flex-col opacity-95">

                {/* Content */}
                <div className="flex-1 relative overflow-hidden bg-bg-primary">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={32} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[1024px] h-[640px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.423)" }}
                    >
                      <PublicProfileDesktop
                        user={profileData.publicUser}
                        links={profileData.links || []}
                        showcaseItems={profileData.showcase_items || []}
                        updates={profileData.updates || []}
                        isPreview={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile mockup */}
              <div className="absolute left-0 bottom-0 z-10 w-[180px] h-[340px] bg-bg-primary rounded-[2rem] border-[10px] border-brand-secondary shadow-2xl flex flex-col overflow-hidden opacity-95">
                <div className="flex-1 relative overflow-hidden bg-bg-primary rounded-[1.2rem]">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[375px] h-[774px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.426)" }}
                    >
                      <PublicProfileMobile
                        user={profileData.publicUser}
                        links={profileData.links || []}
                        showcaseItems={profileData.showcase_items || []}
                        updates={profileData.updates || []}
                        isPreview={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Benefits Section */}
        <section className="py-32 px-12 max-w-6xl mx-auto">
          <FadeInSection className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-6">
                <Layers size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-primary mb-4">
                Everything in one place
              </h3>
              <p className="text-brand-primary/70">
                Your projects, updates, and links — one page instead of five
                different tabs and bios.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-6">
                <Code size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-primary mb-4">
                Your best work, front and center
              </h3>
              <p className="text-brand-primary/70">
                Featured projects get real space to breathe, not squeezed into
                another link row.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-6">
                <EyeOff size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-primary mb-4">
                Only what you need, nothing you don't
              </h3>
              <p className="text-brand-primary/70">
                Skip a section and it just disappears. No empty placeholders, no
                clutter.
              </p>
            </div>
          </FadeInSection>
        </section>

        {/* Connect with the developer */}
        <FadeInSection className="py-12 px-12 max-w-2xl mx-auto border-t border-brand-primary/10 flex flex-col md:flex-row items-center gap-6 justify-center mt-12 mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 shrink-0 flex items-center justify-center font-bold text-brand-accent">
            OP
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-bold text-brand-primary text-lg">
              Built by Om Patil
            </h2>
            <p className="text-brand-primary/70 text-sm mb-3">
              Learning full-stack development, one real project at a time.{" "}
              <span className="text-brand-accent">Threshold</span> is my proof
              of work — built end to end, from the database up.
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
                href="https://ompatil.vercel.app/"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
              >
                My Threshold
              </a>
            </div>
          </div>
        </FadeInSection>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-brand-primary/50 font-medium">
        &copy; {new Date().getFullYear()} Threshold Platform. All rights
        reserved.
      </footer>
    </div>
  );
};

MarketingDesktop.propTypes = {
  onCheckUsername: PropTypes.func,
  onStart: PropTypes.func,
  onLogin: PropTypes.func,
  onSignUp: PropTypes.func,
};
