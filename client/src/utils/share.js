import { toast } from "./toast";

export const handleProfileShare = async (user) => {
  if (!user) return;
  
  const shareData = {
    title: `${user.name} — Threshold`,
    text: user.bio || `Check out ${user.name}'s profile on Threshold`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // user cancelled the share sheet — not an error, do nothing
    }
  } else {
    await navigator.clipboard.writeText(shareData.url);
    toast("Profile link copied to clipboard!");
  }
};
