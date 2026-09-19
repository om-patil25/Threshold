import { useState, useEffect } from "react";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Input } from "../shared/Input";
import {
  User,
  Palette,
  CheckCircle,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminUser, updateUser } from "../../service/userServices";
import { createLink } from "../../service/linkServices";
import { createShowcaseItem } from "../../service/showcaseItmesServices";
import { toast } from "../../utils/toast";
import { Loader } from "../shared/Loader";

const THEMES = [
  { id: "ink-and-ochre", name: "Ink & Ochre" },
  { id: "midnight-slate", name: "Midnight Slate" },
  { id: "neon-cyberpunk", name: "Neon Cyberpunk" },
  { id: "cherry-blossom", name: "Cherry Blossom" },
  { id: "vanilla-latte", name: "Vanilla Latte" },
  { id: "cloud-silver", name: "Cloud Silver" },
  { id: "matcha-cream", name: "Matcha Cream" },
];

export const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User Data
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    workTitle: "",
    bio: "",
    avatar: null,
    theme: "ink-and-ochre",
  });
  const [avatarPreview, setAvatarPreview] = useState("");

  // Content Data
  const [contentType, setContentType] = useState("link"); // 'link' or 'showcase'
  const [linkData, setLinkData] = useState({ label: "", url: "" });
  const [showcaseData, setShowcaseData] = useState({
    title: "",
    description: "",
    url: "",
    filetype: "document",
  });
  const [showcaseFile, setShowcaseFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await getAdminUser();
        if (userRes && userRes.user) {
          const user = userRes.user;
          setUsername(
            user?.username || localStorage.getItem("threshold_username"),
          );
          setFormData({
            name: user.name || "",
            workTitle: user.worktitle || "",
            bio: user.bio || "",
            theme: user.theme || "ink-and-ochre",
            avatar: null,
          });
          if (user.profileimage) setAvatarPreview(user.profileimage);
        }
      } catch (err) {
        toast("Please log in to continue");
        navigate("/auth?mode=login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "File size exceeds 3MB limit" });
        return;
      }
      if (errors.avatar) setErrors({ ...errors, avatar: null });
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleShowcaseFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size exceeds 3MB limit" });
        return;
      }
      if (errors.file) setErrors({ ...errors, file: null });
      setShowcaseFile(file);
    }
  };

  const saveProfileBasics = async () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (!formData.workTitle || formData.workTitle.trim().length < 3) {
      newErrors.workTitle = "Work title must be at least 3 characters";
    }
    if (formData.bio && formData.bio.trim().length > 160) {
      newErrors.bio = "Bio cannot exceed 160 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("worktitle", formData.workTitle);
      data.append("bio", formData.bio);
      if (formData.avatar) {
        data.append("profileimage", formData.avatar);
      }
      await updateUser(data);
      setApiError("");
      setStep(2);
    } catch (err) {
      const errorMsg = err.message || "Failed to save profile";
      setApiError(errorMsg);
      toast(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("theme", formData.theme);
      await updateUser(data);
      setApiError("");
      setStep(3);
    } catch (err) {
      const errorMsg = err.message || "Failed to save theme";
      setApiError(errorMsg);
      toast(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const saveContentAndFinish = async () => {
    const newErrors = {};
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (contentType === "link") {
      if (!linkData.label.trim()) newErrors.label = "Label is required";
      if (!linkData.url.trim()) newErrors.url = "URL is required";
      else if (!urlRegex.test(linkData.url))
        newErrors.url = "Please enter a valid URL";
    } else {
      if (!showcaseData.title.trim()) newErrors.title = "Title is required";
      if (!showcaseFile) newErrors.file = "Image/PDF is required";
      if (showcaseData.url && !urlRegex.test(showcaseData.url))
        newErrors.url = "Please enter a valid URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      if (contentType === "link" && linkData.label && linkData.url) {
        await createLink(linkData);
      } else if (
        contentType === "showcase" &&
        showcaseData.title &&
        showcaseFile
      ) {
        const sData = new FormData();
        sData.append("file_title", showcaseData.title);
        sData.append("description", showcaseData.description);
        sData.append("filetype", showcaseData.filetype);
        sData.append("file", showcaseFile);
        if (showcaseData.url) sData.append("link_url", showcaseData.url);
        await createShowcaseItem(sData);
      }

      // Finalize onboarding
      const completeData = new FormData();
      completeData.append("onboardingComplete", true);
      await updateUser(completeData);

      setApiError("");
      toast("Onboarding complete! Welcome to your dashboard.");
      navigate("/admin/profile");
    } catch (err) {
      const errorMsg = err.message || "Something went wrong saving content.";
      setApiError(errorMsg);
      toast(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const skipAndFinish = async () => {
    setSaving(true);
    try {
      const completeData = new FormData();
      completeData.append("onboardingComplete", true);
      await updateUser(completeData);
      setApiError("");
      navigate("/admin/profile");
    } catch (err) {
      const errorMsg = err.message || "Something went wrong.";
      setApiError(errorMsg);
      toast(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 font-sans text-text-primary">
      <div className="w-full max-w-2xl">
        {/* Branding Header */}
        <div className="font-bold text-3xl tracking-tighter text-brand-primary flex items-center justify-center gap-2 mb-10">
          <img
            src="/logo.png"
            alt="Threshold Logo"
            className="w-10 h-10 object-contain"
          />
          Threshold
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-12 relative max-w-lg mx-auto w-full px-2">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-brand-primary/10 -translate-y-1/2 rounded-full z-0"></div>
          <div
            className="absolute top-1/2 left-4 h-1 bg-brand-accent -translate-y-1/2 rounded-full transition-all duration-500 z-0"
            style={{ width: step === 1 ? "0%" : step === 2 ? "calc(50% - 2rem)" : "calc(100% - 2rem)" }}
          ></div>

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative z-10 ${step >= 1 ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/30 scale-110" : "bg-bg-primary border-2 border-brand-primary/20 text-brand-primary"}`}
          >
            <User size={20} />
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative z-10 ${step >= 2 ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/30 scale-110" : "bg-bg-primary border-2 border-brand-primary/20 text-brand-primary"}`}
          >
            <Palette size={20} />
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative z-10 ${step >= 3 ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/30 scale-110" : "bg-bg-primary border-2 border-brand-primary/20 text-brand-primary"}`}
          >
            <CheckCircle size={20} />
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-200 mb-6 max-w-lg mx-auto text-center">
            {apiError}
          </div>
        )}

        <Card className="p-8 md:p-12 min-h-100 flex flex-col shadow-xl border-2 border-brand-primary/10 rounded-3xl">
          {step === 1 && (
            <div className="grow flex flex-col justify-center animate-in fade-in zoom-in duration-300">
              <h2 className="text-3xl font-bold text-brand-primary mb-2 text-center">
                Welcome, @{username}!
              </h2>
              <p className="text-center text-text-primary mb-8">
                Let's set up the basics for your new profile.
              </p>

              <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-brand-primary/5 flex items-center justify-center border-2 border-dashed border-brand-primary/20 shrink-0 overflow-hidden relative group">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload size={24} className="text-brand-primary" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload size={20} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-brand-primary">
                      Profile Photo (Max 3MB)
                    </span>
                    <span className="text-xs text-brand-primary">
                      Upload your best picture
                    </span>
                    {errors.avatar && (
                      <span className="text-xs font-bold text-red-500 mt-1">
                        {errors.avatar}
                      </span>
                    )}
                  </div>
                </div>

                <Input
                  label="Display Name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  error={errors.name}
                />
                <Input
                  label="Work Title"
                  type="text"
                  placeholder="Frontend Developer"
                  value={formData.workTitle}
                  onChange={(e) => {
                    setFormData({ ...formData, workTitle: e.target.value });
                    if (errors.workTitle) setErrors({ ...errors, workTitle: null });
                  }}
                  error={errors.workTitle}
                />
                <Input
                  as="textarea"
                  label="Bio"
                  rows="3"
                  placeholder="Tell the world about yourself..."
                  value={formData.bio}
                  onChange={(e) => {
                    setFormData({ ...formData, bio: e.target.value });
                    if (errors.bio) setErrors({ ...errors, bio: null });
                  }}
                  error={errors.bio}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grow flex flex-col justify-center animate-in fade-in zoom-in duration-300">
              <h2 className="text-3xl font-bold text-brand-primary mb-2 text-center">
                Choose a Theme
              </h2>
              <p className="text-center text-text-primary mb-2">
                Select a style that matches your vibe.
              </p>
              <p className="text-center text-brand-accent text-sm font-bold mb-8">
                This theme will apply to your public profile.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
                {THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() =>
                      setFormData({ ...formData, theme: theme.id })
                    }
                    className={`border-2 rounded-2xl p-4 cursor-pointer flex flex-col items-center gap-3 transition-all duration-200 ${formData.theme === theme.id ? "border-brand-accent bg-brand-accent/5 scale-[1.02] shadow-md" : "border-brand-primary/10 hover:border-brand-primary/30"}`}
                  >
                    <div
                      className="flex gap-2 w-full h-12 rounded-lg overflow-hidden border border-brand-primary/10"
                      data-theme={theme.id}
                    >
                      <div className="flex-1 bg-bg-primary"></div>
                      <div className="flex-1 bg-brand-primary"></div>
                      <div className="flex-1 bg-brand-accent"></div>
                    </div>
                    <div className="font-bold text-brand-primary capitalize text-sm">
                      {theme.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grow flex flex-col animate-in fade-in zoom-in duration-300">
              <h2 className="text-3xl font-bold text-brand-primary mb-2 text-center">
                Add Your First Piece of Content
              </h2>
              <p className="text-center text-text-primary mb-8">
                Let's give your visitors something to see.
              </p>

              <div className="flex gap-2 p-1 bg-brand-primary/5 rounded-xl max-w-sm mx-auto w-full mb-6">
                <button
                  onClick={() => setContentType("link")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all ${contentType === "link" ? "bg-white shadow-sm text-brand-primary" : "text-brand-primary hover:text-brand-primary"}`}
                >
                  <LinkIcon size={16} /> Link
                </button>
                <button
                  onClick={() => setContentType("showcase")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all ${contentType === "showcase" ? "bg-white shadow-sm text-brand-primary" : "text-brand-primary hover:text-brand-primary"}`}
                >
                  <ImageIcon size={16} /> Featured Work
                </button>
              </div>

              <div className="max-w-md mx-auto w-full flex flex-col gap-4">
                {contentType === "link" ? (
                  <>
                    <Input
                      label="Link Label"
                      type="text"
                      placeholder="My Portfolio"
                      value={linkData.label}
                      onChange={(e) => {
                        setLinkData({ ...linkData, label: e.target.value });
                        if (errors.label) setErrors({ ...errors, label: null });
                      }}
                      error={errors.label}
                    />
                    <Input
                      label="URL"
                      type="url"
                      placeholder="https://"
                      value={linkData.url}
                      onChange={(e) => {
                        setLinkData({ ...linkData, url: e.target.value });
                        if (errors.url) setErrors({ ...errors, url: null });
                      }}
                      error={errors.url}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Title"
                      type="text"
                      placeholder="Project Name"
                      value={showcaseData.title}
                      onChange={(e) => {
                        setShowcaseData({
                          ...showcaseData,
                          title: e.target.value,
                        });
                        if (errors.title) setErrors({ ...errors, title: null });
                      }}
                      error={errors.title}
                    />
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-bold text-brand-primary">
                        Image/PDF (Max 3MB)
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          handleShowcaseFileChange(e);
                          if (errors.file) setErrors({ ...errors, file: null });
                        }}
                        className={`bg-white border-2 rounded-xl px-4 py-2 outline-none focus:border-brand-accent transition-colors text-sm ${errors.file ? "border-red-500 bg-red-50/50" : "border-brand-primary/10"}`}
                      />
                      {errors.file && (
                        <span className="text-xs font-semibold text-red-500 mt-1">
                          {errors.file}
                        </span>
                      )}
                    </div>
                    <Input
                      label="Optional Link URL"
                      type="url"
                      placeholder="https://"
                      value={showcaseData.url}
                      onChange={(e) => {
                        setShowcaseData({
                          ...showcaseData,
                          url: e.target.value,
                        });
                        if (errors.url) setErrors({ ...errors, url: null });
                      }}
                      error={errors.url}
                    />
                    <Input
                      as="textarea"
                      label="Description (Optional)"
                      rows="2"
                      placeholder="Brief details about this work..."
                      value={showcaseData.description}
                      onChange={(e) =>
                        setShowcaseData({
                          ...showcaseData,
                          description: e.target.value,
                        })
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center border-t border-brand-primary/10 pt-6">
            {step === 1 && (
              <Button
                variant="ghost"
                className="text-brand-primary hover:text-brand-primary"
                onClick={skipAndFinish}
                disabled={saving}
              >
                Skip Onboarding
              </Button>
            )}
            {step === 2 && (
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={saving}
              >
                Back
              </Button>
            )}
            {step === 3 && (
              <Button
                variant="ghost"
                className="text-brand-primary hover:text-brand-primary"
                onClick={skipAndFinish}
                disabled={saving}
              >
                Skip this step
              </Button>
            )}

            {step === 1 && (
              <Button
                variant="accent"
                className="px-8 ml-auto min-w-30"
                onClick={saveProfileBasics}
                disabled={saving}
              >
                {saving ? "Processing..." : "Continue"}
              </Button>
            )}
            {step === 2 && (
              <Button
                variant="accent"
                className="px-8 ml-auto min-w-30"
                onClick={saveTheme}
                disabled={saving}
              >
                {saving ? "Processing..." : "Continue"}
              </Button>
            )}
            {step === 3 && (
              <Button
                variant="accent"
                className="px-8 ml-auto min-w-30"
                onClick={saveContentAndFinish}
                disabled={saving}
              >
                {saving ? "Processing..." : "Finish"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

