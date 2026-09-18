import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { useDashboard } from "../../context/DashboardContext";
import { updateUser } from "../../service/userServices";
import { toast } from "../../utils/toast";
import { Loader } from "../shared/Loader";

const THEMES = [
  {
    id: "ink-and-ochre",
    name: "Ink & Ochre",
    colors: ["#FAF7F2", "#2B2620", "#C9622A"],
  },
  {
    id: "paper-and-moss",
    name: "Paper & Moss",
    colors: ["#F5F3ED", "#3F4A38", "#D98E5D"],
  },
  {
    id: "bone-and-violet",
    name: "Bone & Violet",
    colors: ["#FAFAFA", "#6C4AB6", "#F2C94C"],
  },
  {
    id: "classic-minimal",
    name: "Classic Minimal",
    colors: ["#FFFFFF", "#171717", "#000000"],
  },
  {
    id: "forest-retreat",
    name: "Forest Retreat",
    colors: ["#F0FDF4", "#064E3B", "#22C55E"],
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    colors: ["#F0F9FF", "#172554", "#F43F5E"],
  },
  {
    id: "midnight-slate",
    name: "Midnight Slate",
    colors: ["#0F111A", "#F8FAFC", "#5EEAD4"],
  },
  {
    id: "vanilla-latte",
    name: "Vanilla Latte",
    colors: ["#FFFAF0", "#27140B", "#C48C5A"],
  },
  {
    id: "cloud-silver",
    name: "Cloud Silver",
    colors: ["#F8FAFC", "#0F172A", "#6366F1"],
  },
  {
    id: "matcha-cream",
    name: "Matcha Cream",
    colors: ["#FDFDF9", "#152418", "#688E55"],
  },
  {
    id: "hacker-terminal",
    name: "Hacker Terminal",
    colors: ["#0A0A0A", "#22C55E", "#4ADE80"],
  },
  {
    id: "sunset-noir",
    name: "Sunset Noir",
    colors: ["#121212", "#FAFAFA", "#F43F5E"],
  },
  {
    id: "abyss-blue",
    name: "Abyss Blue",
    colors: ["#020617", "#F1F5F9", "#FBBF24"],
  },
  {
    id: "neon-cyberpunk",
    name: "Neon Cyberpunk",
    colors: ["#09090B", "#FF2A6D", "#05D9E8"],
  },
  {
    id: "lavender-dusk",
    name: "Lavender Dusk",
    colors: ["#1E1B4B", "#E0E7FF", "#FBBF24"],
  },
  {
    id: "minty-fresh",
    name: "Minty Fresh",
    colors: ["#ECFDF5", "#059669", "#10B981"],
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    colors: ["#FDF2F8", "#DB2777", "#F472B6"],
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    colors: ["#030712", "#38BDF8", "#0284C7"],
  },
];

export const SettingsEditor = () => {
  const { user, refreshData } = useDashboard();
  const [activeTheme, setActiveTheme] = useState("ink-and-ochre");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveTheme(user?.theme || "ink-and-ochre");
  }, [user]);

  const handleSaveTheme = async () => {
    try {
      setIsSaving(true);
      await updateUser({ theme: activeTheme });
      toast("Theme saved! Check the public profile to see it applied.");
      refreshData();
    } catch (e) {
      toast(e.message || "Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

  const previewUser = user
    ? {
      ...user,
      theme: activeTheme,
    }
    : null;

  const EditorContent = (
    <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-brand-primary/10 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">Settings</h1>
      </div>

      <Card className="p-6 flex flex-col gap-6 shadow-sm border border-brand-primary/5">
        <h3 className="font-bold text-brand-primary text-xl pb-2">
          Appearance
        </h3>
        <p className="text-sm text-brand-primary/60 -mt-2">
          Choose a color theme for your public profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-3 ${activeTheme === theme.id
                  ? "border-brand-accent shadow-md bg-brand-accent/5"
                  : "border-brand-primary/10 hover:border-brand-primary/30 bg-white"
                }`}
            >
              <div className="font-bold text-brand-primary">{theme.name}</div>
              <div className="flex h-8 rounded-lg overflow-hidden border border-brand-primary/10">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end pt-4 border-t border-brand-primary/10 mt-4">
          <Button
            variant="primary"
            onClick={handleSaveTheme}
            className="bg-brand-accent hover:bg-[#6D28D9]"
            disabled={isSaving}
          >
            {isSaving ? "Processing..." : "Save Theme"}
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <DashboardLayout previewUser={previewUser}>{EditorContent}</DashboardLayout>
  );
};
