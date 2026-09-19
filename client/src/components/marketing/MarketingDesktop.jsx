import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowRight, Sparkles, Code, Layers, EyeOff, LayoutTemplate, Link as LinkIcon, Store, ChevronDown } from "lucide-react";
import { MarketingBenefits, MarketingHelpCTA, MarketingDeveloper, MarketingFooter } from "./MarketingPage";
import { FadeInSection } from "../shared/FadeInSection";
import { fetchPublicUser } from "../../service/userServices";
import { PublicProfileDesktop } from "../publicProfile/PublicProfileDesktop";
import { PublicProfileMobile } from "../publicProfile/PublicProfileMobile";
import { Loader } from "../shared/Loader";
import { MarketingNavbarDesktop } from "./MarketingNavbarDesktop";

const DYNAMIC_WORDS = ["portfolio", "storefront", "link in bio"];

export const MarketingDesktop = ({
  onCheckUsername,
  isUsernameAvailable,
  onStart,
  onLogin,
  onSignUp,
  onAdmin,
  isLoggedIn,
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
        // Silently handle mock data fetch errors to avoid console noise
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
      <MarketingNavbarDesktop 
        isLoggedIn={isLoggedIn}
        onAdmin={onAdmin}
        onLogin={onLogin}
        onSignUp={onSignUp}
      />

      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 min-h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-bg.webp"
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
            <p className="text-xl text-brand-primary mb-12 max-w-2xl mx-auto">
              One page that's whatever you need it to be — free, for anyone who
              wants a real presence online.
            </p>

            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="flex bg-white border-2 border-brand-accent rounded-full p-1 w-full shadow-lg relative">
                <div className="flex items-center pl-6 text-brand-primary font-medium select-none">
                  thrshld.in/
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
                  aria-label="Start creating your threshold profile"
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

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <button
              onClick={() => {
                document.getElementById('make-presence').scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-brand-primary hover:text-brand-accent transition-colors p-2 rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-brand-primary/10"
              aria-label="Scroll down"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </section>

        {/* Make Your Presence Section */}
        <section id="make-presence" className="bg-white text-brand-primary py-32 px-12 border-y border-brand-primary/5">
          <FadeInSection className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-5xl font-bold mb-6 text-brand-accent">
                Make Your Presence
              </h2>
              <p className="text-xl text-brand-primary mb-8 leading-relaxed">
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

        {/* Use As Section */}
        <section className="relative bg-bg-primary text-brand-primary py-32 px-12 overflow-hidden">
          {/* Ambient background gradients */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] translate-y-1/3"></div>

          <div className="max-w-6xl mx-auto flex flex-col gap-32 relative z-10">
            {/* Portfolio */}
            <FadeInSection className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 flex justify-center">
                <div className="w-[300px] h-[400px] bg-white rounded-[2rem] border-[8px] border-brand-accent shadow-xl overflow-hidden flex flex-col relative bg-bg-primary">
                  <img src="/src/assets/mockananaya.webp" loading="lazy" alt="Portfolio Preview" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold mb-6 text-brand-accent">
                  Use as a portfolio.
                </h3>
                <p className="text-xl text-brand-primary mb-8 leading-relaxed">
                  Feature your best projects, certifications, and achievements — the work speaks for itself.
                </p>
                <button
                  onClick={onSignUp}
                  className="px-8 py-3 font-bold bg-brand-accent text-white rounded-full hover:bg-[#6D28D9] transition-colors"
                  aria-label="Get started with a portfolio"
                >
                  Get Started
                </button>
              </div>
            </FadeInSection>

            {/* Link-in-bio */}
            <FadeInSection className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 flex justify-center">
                <div className="w-[300px] h-[400px] bg-white rounded-[2rem] border-[8px] border-brand-secondary shadow-xl overflow-hidden flex flex-col relative bg-bg-primary">
                  <img src="/src/assets/mockkabir.webp" loading="lazy" alt="Link-in-bio Preview" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold mb-6 text-brand-secondary">
                  Use as a link-in-bio.
                </h3>
                <p className="text-xl text-brand-primary mb-8 leading-relaxed">
                  Just links, done simply. Send people everywhere that matters, from one clean page.
                </p>
                <button
                  onClick={onSignUp}
                  className="px-8 py-3 font-bold bg-brand-secondary text-white rounded-full hover:bg-[#02c880] transition-colors"
                  aria-label="Get started with a link-in-bio"
                >
                  Get Started
                </button>
              </div>
            </FadeInSection>

            {/* Storefront */}
            <FadeInSection className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 flex justify-center">
                <div className="w-[300px] h-[400px] bg-white rounded-[2rem] border-[8px] border-brand-primary shadow-xl overflow-hidden flex flex-col relative bg-bg-primary">
                  <img src="/src/assets/mockarjun.webp" loading="lazy" alt="Storefront Preview" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold mb-6 text-brand-primary">
                  Use as a storefront.
                </h3>
                <p className="text-xl text-brand-primary mb-8 leading-relaxed">
                  Showcase what you offer and link straight to where people can buy or book — no cart, no checkout hassle, just a clear path to you.
                </p>
                <button
                  onClick={onSignUp}
                  className="px-8 py-3 font-bold bg-brand-primary text-white rounded-full hover:bg-black transition-colors"
                  aria-label="Get started with a storefront"
                >
                  Get Started
                </button>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Benefits Section */}
        <MarketingBenefits />

        <MarketingHelpCTA />

        {/* Connect with the developer */}
        <MarketingDeveloper />
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
};

MarketingDesktop.propTypes = {
  onCheckUsername: PropTypes.func,
  onStart: PropTypes.func,
  onLogin: PropTypes.func,
  onSignUp: PropTypes.func,
};

