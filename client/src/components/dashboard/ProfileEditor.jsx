import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Input } from "../shared/Input";
import { Upload, Save } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import { updateUser } from "../../service/userServices";
import { toast } from "../../utils/toast";
import { Loader } from "../shared/Loader";

export const ProfileEditor = () => {
  const { user, refreshData } = useDashboard();

  const [activeTheme, setactiveTheme] = useState("ink-and-ochre");
  const [displayName, setDisplayName] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setactiveTheme(user?.theme || "ink-and-ochre");
    setDisplayName(user?.name || "");
    setWorkTitle(user?.worktitle || "");
    setBio(user?.bio || "");
    setAvatarImage(user?.profileimage || "");
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;
    
    if (file.size > 3 * 1024 * 1024) {
      setErrors({ ...errors, avatarFile: "File size exceeds 3MB limit" });
      return;
    }
    
    if (errors.avatarFile) setErrors({ ...errors, avatarFile: null });
    
    setAvatarFile(file);
    setAvatarImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (displayName.trim().length < 3) {
      setErrors({ displayName: "Display Name must be at least 3 characters" });
      return;
    }
    
    try {
      setIsSaving(true);
      const formData = new FormData();

      formData.append("name", displayName);
      formData.append("worktitle", workTitle);
      formData.append("bio", bio);
      formData.append("profileimage", avatarFile);
      const response = await updateUser(formData);
      toast("Profile updated successfully");
      refreshData();
    } catch (e) {
      toast(e.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const previewUser = user
    ? {
        ...user,
        name: displayName,
        worktitle: workTitle,
        bio: bio,
        theme: activeTheme,
        profileimage: avatarImage,
      }
    : null;

  const EditorContent = (
    <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-brand-primary/10 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">Edit Profile</h1>
      </div>

      <Card className="p-6 flex flex-col gap-6 shadow-sm border border-brand-primary/5">
        <h3 className="font-bold text-brand-primary text-xl pb-2">
          Profile Identity
        </h3>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-24 h-24 rounded-full bg-brand-primary/5 flex items-center justify-center border border-dashed border-brand-primary/20 shrink-0 overflow-hidden">
            {avatarImage ? (
              <img
                src={avatarImage}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload size={24} className="text-brand-primary" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            <Button
              variant="secondary"
              className="w-fit text-sm py-2 px-4 border-brand-primary/20"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Avatar
            </Button>
            <p className="text-xs text-brand-primary">
              Recommended size: 400x400px (Max 3MB)
            </p>
            {errors.avatarFile && (
              <p className="text-xs font-bold text-red-500 mt-1">
                {errors.avatarFile}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Display Name"
            type="text" 
            value={displayName} 
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (errors.displayName) setErrors({...errors, displayName: null});
            }} 
            error={errors.displayName}
          />
          <Input 
            label="Work Title"
            type="text" 
            value={workTitle} 
            onChange={(e) => setWorkTitle(e.target.value)} 
          />
        </div>

        <Input 
          as="textarea"
          label="Bio"
          rows="4" 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
        />

        <div className="flex justify-end pt-4">
          <Button
            variant="primary"
            className="gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              "Processing..."
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <DashboardLayout previewUser={previewUser}>{EditorContent}</DashboardLayout>
  );
};

