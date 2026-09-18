import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowRight, Sparkles, Code, Layers, EyeOff, LayoutTemplate, Link as LinkIcon, Store, ChevronDown, Menu } from "lucide-react";
import { MarketingBenefits, MarketingDeveloper, MarketingFooter } from "./MarketingPage";
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
  onAdmin,
  isLoggedIn,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileData1, setProfileData1] = useState(null);
  const [profileData2, setProfileData2] = useState(null);
  const [profileData3, setProfileData3] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchPublicUser("mockpriya");
        const data1 = await fetchPublicUser("mockananya");
        const data2 = await fetchPublicUser("mockkabir");
        const data3 = await fetchPublicUser("mockarjun");
        setProfileData(data);
        setProfileData1(data1);
        setProfileData2(data2);
        setProfileData3(data3);
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
            <img src="/logo.png" alt="Threshold Logo" className="w-6 h-6 object-contain" />
            Threshold
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          <div
            className={`absolute top-[98%] left-0 w-full bg-white shadow-xl border-brand-primary/10 rounded-b-2xl transition-all duration-300 ease-in-out z-[-1] grid ${menuOpen
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

      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-bg.webp"
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
                  thrshld.in/
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

        {/* Use As Section */}
        <section className="relative bg-bg-primary text-brand-primary py-20 px-6 overflow-hidden">
          {/* Ambient background gradients */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-brand-secondary/10 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-primary/10 rounded-full blur-[70px] translate-y-1/4"></div>

          <div className="flex flex-col gap-24 relative z-10">
            {/* Portfolio */}
            <FadeInSection className="flex flex-col gap-8 text-center">
              <div className="flex justify-center">
                <div className="w-[240px] h-[320px] bg-white rounded-t-3xl border-t-8 border-x-8 border-b-0 border-brand-accent shadow-xl overflow-hidden flex flex-col relative bg-bg-primary">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[375px] h-[522px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.597)" }}
                    >
                      <PublicProfileMobileComponent
                        user={profileData1.publicUser}
                        links={profileData1.links || []}
                        showcaseItems={profileData1.showcase_items || []}
                        updates={[]}
                        isPreview={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-brand-accent">
                  Use as a portfolio.
                </h3>
                <p className="text-lg text-brand-primary/80 mb-6 leading-relaxed">
                  Feature your best projects, certifications, and achievements — the work speaks for itself.
                </p>
                <button
                  onClick={onSignUp}
                  className="px-8 py-3 font-bold bg-brand-accent text-white rounded-full hover:bg-[#6D28D9] transition-colors w-full"
                >
                  Get Started
                </button>
              </div>
            </FadeInSection>

            {/* Link-in-bio */}
            <FadeInSection className="flex flex-col gap-8 text-center">
              <div className="flex justify-center">
                <div className="w-[240px] h-[320px] bg-white rounded-t-3xl border-t-8 border-x-8 border-b-0 border-brand-secondary shadow-xl overflow-hidden flex flex-col relative bg-bg-primary">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[375px] h-[522px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.597)" }}
                    >
                      <PublicProfileMobileComponent
                        user={profileData2.publicUser}
                        links={profileData2.links || []}
                        showcaseItems={[]}
                        updates={[]}
                        isPreview={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-brand-secondary">
                  Use as a link-in-bio.
                </h3>
                <p className="text-lg text-brand-primary/80 mb-6 leading-relaxed">
                  Just links, done simply. Send people everywhere that matters, from one clean page.
                </p>
                <button
                  onClick={onSignUp}
                  className="px-8 py-3 font-bold bg-brand-secondary text-white rounded-full hover:bg-[#8B5CF6] transition-colors w-full"
                >
                  Get Started
                </button>
              </div>
            </FadeInSection>

            {/* Storefront */}
            <FadeInSection className="flex flex-col gap-8 text-center">
              <div className="flex justify-center">
                <div className="w-[240px] h-[320px] bg-white rounded-t-3xl border-t-8 border-x-8 border-b-0 border-brand-primary shadow-xl overflow-hidden flex flex-col relative bg-bg-primary">
                  {loadingProfile || !profileData ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 w-[375px] h-[522px] origin-top-left pointer-events-none hide-scrollbar overflow-hidden"
                      style={{ transform: "scale(0.597)" }}
                    >
                      <PublicProfileMobileComponent
                        user={profileData3.publicUser}
                        links={(profileData3.links || []).slice(0, 2)}
                        showcaseItems={[...(profileData3.showcase_items || [])].reverse().slice(0, 2)}
                        updates={[]}
                        isPreview={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-brand-primary">
                  Use as a storefront.
                </h3>
                <p className="text-lg text-brand-primary/80 mb-6 leading-relaxed">
                  Showcase what you offer and link straight to where people can buy or book — no cart, no checkout hassle, just a clear path to you.
                </p>
                <button
                  onClick={onSignUp}
                  className="px-8 py-3 font-bold bg-brand-primary text-white rounded-full hover:bg-black transition-colors w-full"
                >
                  Get Started
                </button>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Benefits Section */}
        <MarketingBenefits />

        {/* Connect with the developer */}
        <MarketingDeveloper />
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
};

MarketingMobile.propTypes = {
  onCheckUsername: PropTypes.func,
  onStart: PropTypes.func,
  onLogin: PropTypes.func,
  onSignUp: PropTypes.func,
};
