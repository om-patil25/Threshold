import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Code, Layers, EyeOff, Menu } from "lucide-react";
import { FadeInSection } from "../shared/FadeInSection";
import { fetchPublicUser } from "../../service/userServices";
import { PublicProfileDesktop } from "../publicProfile/PublicProfileDesktop";
import { PublicProfileMobile as PublicProfileMobileComponent } from "../publicProfile/PublicProfileMobile";
import { Loader } from "../shared/Loader";

const DYNAMIC_WORDS = ["portfolio", "storefront", "link in bio"];

export const MarketingMobile = ({
  onCheckUsername,
  isUsernameAvailable,
  onStart,
  onLogin,
  onSignUp,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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
        <header className="flex justify-between items-center px-6 py-4 w-full bg-white/90 backdrop-blur-md border border-t-0 border-brand-accent/20 rounded-b-2xl shadow-sm relative">
          <div className="font-bold text-xl tracking-tighter text-brand-primary flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-sm">
              T
            </div>
            Threshold
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
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
              </div>
            </div>
          </div>
        </header>
      </div>

      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
              alt="Desk"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm"></div>
          </div>

          <FadeInSection className="relative z-10 px-6 text-center w-full">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-primary mb-6">
              Your work.
              <br />
              Your links.
              <br />
              Your{" "}
              <span className="text-brand-accent relative inline-block min-w-43.5">
                <span
                  className={`inline-block transition-opacity duration-500 ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}
                >
                  {DYNAMIC_WORDS[wordIndex]}
                </span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-brand-accent/20 -z-10"></span>
              </span>
            </h1>
            <p className="text-lg text-brand-primary/70 mb-10">
              One page that's whatever you need it to be — free, for anyone who
              wants a real presence online.
            </p>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <div className="flex bg-white border-2 border-brand-accent rounded-xl p-2 w-full shadow-md text-left">
                <span className="text-brand-primary/50 font-medium pl-2 pr-1 my-auto">
                  threshold.me/
                </span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="grow bg-transparent outline-none w-full text-brand-accent font-medium py-2 placeholder:text-brand-primary/30"
                />
              </div>
              <button
                className="w-full py-4 text-lg font-bold bg-brand-accent text-white rounded-xl hover:bg-[#6D28D9] transition-colors shadow-md"
                onClick={() => onStart && onStart(username)}
              >
                Start
              </button>
              {username && isUsernameAvailable !== null && (
                <div
                  className={`mt-2 text-sm font-bold ${isUsernameAvailable ? "text-green-500" : "text-red-500"}`}
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
        <section className="bg-white text-brand-primary py-16 px-6 border-y border-brand-primary/5">
          <FadeInSection className="flex flex-col gap-10 text-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-brand-accent">
                Make Your Presence
              </h2>
              <p className="text-lg text-brand-primary/80 leading-relaxed">
                Two real, separately-designed layouts — a horizontal desktop
                experience and a vertical mobile view.
              </p>
            </div>
            <div className="flex flex-col gap-8 items-center justify-center">
              <div className="w-full max-w-xs h-64 bg-bg-primary rounded-t-xl border-t-8 border-x-8 border-brand-accent relative overflow-hidden shadow-2xl flex flex-col opacity-95 mx-auto text-left">

                <div className="flex-1 relative overflow-hidden bg-bg-primary">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[1024px] h-[780px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.3)" }}
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
              <div className="w-48 h-72 bg-bg-primary rounded-t-3xl border-t-8 border-x-8 border-brand-secondary relative overflow-hidden shadow-2xl flex flex-col opacity-95 mx-auto -mt-16 z-10 border-b-0 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] text-left">
                <div className="flex-1 relative overflow-hidden bg-bg-primary rounded-[1.2rem]">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[375px] h-[610px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.469)" }}
                    >
                      <PublicProfileMobileComponent
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
        <section className="py-20 px-6">
          <FadeInSection className="flex flex-col gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
                <Layers size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-primary mb-3">
                Everything in one place
              </h3>
              <p className="text-brand-primary/70">
                Your projects, updates, and links — one page instead of five
                different tabs and bios.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
                <Code size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-primary mb-3">
                Your best work, front and center
              </h3>
              <p className="text-brand-primary/70">
                Featured projects get real space to breathe, not squeezed into
                another link row.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
                <EyeOff size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-primary mb-3">
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
        <FadeInSection className="py-12 px-6 border-t border-brand-primary/10 flex flex-col items-center text-center mt-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent mb-4">
            OP
          </div>
          <div>
            <h2 className="font-bold text-brand-primary text-lg">
              Built by Om Patil
            </h2>
            <p className="text-brand-primary/70 text-sm mb-4">
              Learning full-stack development, one real project at a time.{" "}
              <span className="text-brand-accent">Threshold</span> is my proof
              of work — built end to end, from the database up.
            </p>
            <div className="flex gap-4 justify-center text-sm text-brand-accent font-medium">
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
      <footer className="py-6 border-t border-brand-primary/5 text-center text-sm text-brand-primary/50 font-medium">
        &copy; {new Date().getFullYear()} Threshold Platform.
      </footer>
    </div>
  );
};

MarketingMobile.propTypes = {
  onCheckUsername: PropTypes.func,
  onStart: PropTypes.func,
  onLogin: PropTypes.func,
  onSignUp: PropTypes.func,
};
