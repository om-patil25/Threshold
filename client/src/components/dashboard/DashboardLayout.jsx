import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "../../utils/toast";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Link as LinkIcon,
  BarChart,
  Settings,
  HelpCircle,
  Menu,
  Eye,
  X,
  Copy,
  User,
  LogOut,
} from "lucide-react";
import { PublicProfileMobile } from "../publicProfile/PublicProfileMobile";
import { useDashboard } from "../../context/DashboardContext";
import { Loader } from "../shared/Loader";
import { logoutUser } from "../../service/userServices";
import { ConfirmModal } from "../shared/ConfirmModal";

const NAV_ITEMS = [
  { label: "Profile", path: "/admin/profile", icon: User },
  { label: "Updates", path: "/admin/updates", icon: LayoutDashboard },
  { label: "Featured", path: "/admin/featured", icon: ImageIcon },
  { label: "Links", path: "/admin/links", icon: LinkIcon },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart },
];

export const DashboardLayout = ({
  children,
  previewUser,
  previewLinks,
  previewShowcase,
  previewUpdates,
}) => {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, links, updates, showcase } = useDashboard();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { message } = await logoutUser();
      toast(message);
      navigate("/auth?mode=login");
    } catch (err) {
      console.error("logout failed " + err);
      toast(err.message || "logout failed!");
      setIsLoggingOut(false);
    }
  };

  const defaultUser = user
    ? {
      ...user,
      theme: user.theme || "ink-and-ochre",
    }
    : null;

  const finalUser = previewUser || defaultUser;
  const finalLinks = previewLinks || links;
  const finalShowcase = previewShowcase || showcase;
  const finalUpdates = previewUpdates || updates;

  const renderPreview = () => {
    if (!finalUser)
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm">
          <Loader size={48} />
        </div>
      );
    return (
      <PublicProfileMobile
        user={finalUser}
        links={finalLinks}
        showcaseItems={finalShowcase}
        updates={finalUpdates}
        isPreview={true}
      />
    );
  };

  const NavSidebar = () => (
    <div className="w-64 shrink-0 border-r border-brand-primary/10 h-full min-h-0 flex flex-col bg-bg-primary text-brand-primary p-4">
      <div className="font-bold text-2xl tracking-tighter text-brand-primary flex items-center justify-start gap-2 mb-6 px-4">
        <img
          src="/logo.png"
          alt="Threshold Logo"
          className="w-8 h-8 object-contain"
        />
        Threshold
      </div>
      {finalUser && (
        <div className="px-4 mb-6 flex items-center justify-start gap-3">
          {finalUser.profileimage ? (
            <img
              src={finalUser.profileimage}
              alt={finalUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary/10 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold border-2 border-brand-primary/10 shadow-sm">
              {finalUser.name?.[0] || "U"}
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm text-brand-primary truncate">
              {finalUser.name}
            </span>
            <span className="text-xs text-brand-primary/60 truncate">
              @
              {finalUser.username ||
                finalUser.name?.toLowerCase().replace(/\s/g, "") ||
                "user"}
            </span>
          </div>
        </div>
      )}
      <ul className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pb-4 m-0 p-0 list-none">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                  ? "bg-brand-accent text-white shadow-md"
                  : "text-brand-primary/70 hover:bg-brand-primary/5 hover:text-brand-primary"
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-brand-primary/10 flex flex-col gap-2 shrink-0">
        <NavLink
          to="/admin/settings"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full transition-colors ${isActive ? "bg-brand-primary/5 text-brand-primary" : "text-brand-primary/70 hover:bg-brand-primary/5 hover:text-brand-primary"}`
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
        <NavLink
          to="/admin/support"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full transition-colors ${isActive ? "bg-brand-primary/5 text-brand-primary" : "text-brand-primary/70 hover:bg-brand-primary/5 hover:text-brand-primary"}`
          }
        >
          <HelpCircle size={20} />
          Help & Support
        </NavLink>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setShowLogoutConfirm(true);
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-red-500/70 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );

  const PreviewPanel = () => (
    <div className="w-96 shrink-0 bg-brand-primary/5 h-full border-l border-brand-primary/10 flex flex-col items-center justify-center p-8">
      <div className="w-[320px] mb-4 bg-white border border-brand-primary/10 rounded-full py-2 pl-4 pr-2 text-center text-sm font-medium text-brand-primary/50 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LinkIcon size={14} /> thrshld.in/
          {finalUser?.username || "username"}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `https://thrshld.in/${finalUser?.username || "username"}`,
            );
            toast("Link copied to clipboard!");
          }}
          className="p-1.5 hover:bg-brand-primary/10 rounded-full transition-colors text-brand-primary shrink-0"
          title="Copy Link"
        >
          <Copy size={14} />
        </button>
      </div>
      <div
        className="w-[320px] h-162.5 bg-white rounded-4xl border-12 border-brand-primary shadow-2xl overflow-hidden relative preview-container"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden hide-scrollbar relative">
          {renderPreview()}
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .preview-container, .preview-container * {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.8)" stroke-width="2"/></svg>') 16 16, auto !important;
          }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `,
          }}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-screen w-full flex flex-col bg-bg-primary font-sans overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-brand-primary/10 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-brand-accent"
          >
            <Menu size={24} />
          </button>
          <div className="font-bold text-xl text-brand-primary">Dashboard</div>
          <button
            onClick={() => setMobilePreviewOpen(true)}
            className="p-2 text-brand-accent"
          >
            <Eye size={24} />
          </button>
        </header>

        {/* Mobile Content */}
        <main className="flex-grow overflow-y-auto">{children}</main>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 z-50 flex transition-all duration-300 ease-in-out ${mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        >
          <div
            className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div
            className={`relative w-72 h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-primary"
            >
              <X size={24} />
            </button>
            <div className="pt-16 h-full">
              <NavSidebar />
            </div>
          </div>
        </div>

        {/* Mobile Preview Overlay */}
        <div
          className={`fixed inset-0 z-50 flex bg-bg-primary flex-col transition-transform duration-300 ease-in-out ${mobilePreviewOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <header className="h-16 flex items-center justify-between px-4 border-b border-brand-primary/10">
            <div className="font-bold text-lg text-brand-primary">
              Live Preview
            </div>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="p-2 text-brand-primary"
            >
              <X size={24} />
            </button>
          </header>
          <div className="flex-grow overflow-y-auto">{renderPreview()}</div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .thin-scrollbar::-webkit-scrollbar { width: 4px; }
          .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
          .thin-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
          .thin-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.1) transparent; }
        `,
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-bg-primary font-sans overflow-hidden">
      <NavSidebar />
      <main className="flex-grow overflow-y-auto custom-scrollbar bg-white/50">
        {children}
      </main>
      <PreviewPanel />
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to log out? You'll need to log back in to access your dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isProcessing={isLoggingOut}
      />
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  previewUser: PropTypes.object,
  previewLinks: PropTypes.array,
  previewShowcase: PropTypes.array,
  previewUpdates: PropTypes.array,
};
