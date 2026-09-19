import { useState, useEffect } from "react";
import { PublicProfileDesktop } from "./PublicProfileDesktop";
import { PublicProfileMobile } from "./PublicProfileMobile";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { fetchPublicUser } from "../../service/userServices";
import { useParams, Link } from "react-router-dom";
import { toast } from "../../utils/toast";
import { registerClick } from "../../service/linkServices";
import { Loader } from "../shared/Loader";

export const PublicProfilePage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // For testing auto-hide, you can set these to []
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchPublicUser(username);
        setProfileData(data);
      } catch (err) {
        console.error(err);
        toast(err.message || "profile not found!");
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      getProfile();
    }
  }, [username]);

  if (loading)
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm"
        data-theme={profileData?.publicUser?.theme || "ink-and-ochre"}
      >
        <Loader size={64} />
      </div>
    );

  if (!profileData)
    return (
      <div className="min-h-screen bg-bg-primary font-sans flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex items-center gap-2">
          <img src="/logo.png" alt="Threshold Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-3xl tracking-tighter text-brand-primary">Threshold</span>
        </div>
        <div className="max-w-md w-full bg-white border border-brand-primary/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-brand-primary">?</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-primary mb-2 tracking-tight">
            Profile Not Found
          </h1>
          <p className="text-brand-primary mb-8">
            The username{" "}
            <span className="font-bold text-brand-primary">@{username}</span> is
            still available. Claim it before someone else does!
          </p>
          <Link
            to="/auth?mode=signup"
            className="w-full bg-brand-accent text-white font-bold py-4 px-6 rounded-xl shadow-md hover:opacity-90 hover:-translate-y-1 transition-all text-center block"
          >
            Make This Username Yours
          </Link>
          <Link
            to="/"
            className="mt-4 text-sm font-medium text-brand-primary hover:text-brand-primary transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  const { publicUser, links, showcase_items, updates } = profileData;

  const sortByDateDesc = (arr, dateField = "createdAt") => {
    return [...arr].sort(
      (a, b) => new Date(b[dateField] || 0) - new Date(a[dateField] || 0),
    );
  };

  const sortByPosition = (arr) => {
    return [...arr].sort((a, b) => a.position - b.position);
  };

  const sortedLinks = sortByPosition(links || []);
  const sortedUpdates = sortByDateDesc(updates || []);
  const sortedShowcase = sortByDateDesc(showcase_items || []);

  const onClickonLink = async (link) => {
    await registerClick(link.id).catch((err) =>
      console.error("click register failed" + err),
    );
  };

  if (isMobile) {
    return (
      <PublicProfileMobile
        user={publicUser}
        links={sortedLinks}
        onClickonLink={onClickonLink}
        showcaseItems={sortedShowcase}
        updates={sortedUpdates}
        isPreview={false}
      />
    );
  }

  return (
    <>
      <PublicProfileDesktop
        user={publicUser}
        links={sortedLinks}
        onClickonLink={onClickonLink}
        showcaseItems={sortedShowcase}
        updates={sortedUpdates}
        isPreview={false}
      />
    </>
  );
};

