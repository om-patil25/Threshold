import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { MarketingPage } from "./components/marketing/MarketingPage";
import { PublicProfilePage } from "./components/publicProfile/PublicProfilePage";
import { UpdatesEditor } from "./components/dashboard/UpdatesEditor";
import { LinksEditor } from "./components/dashboard/LinksEditor";
import { ShowcaseEditor } from "./components/dashboard/ShowcaseEditor";
import { AnalyticsEditor } from "./components/dashboard/AnalyticsEditor";
import { SettingsEditor } from "./components/dashboard/SettingsEditor";
import { ProfileEditor } from "./components/dashboard/ProfileEditor";
import { HelpAndSupport } from "./components/dashboard/HelpAndSupport";
import { AuthForms } from "./components/auth/AuthForms";
import { OnboardingWizard } from "./components/auth/OnboardingWizard";
import { Toast } from "./components/shared/Toast";
import { DashboardProvider } from "./context/DashboardContext";

// Placeholder components
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4 text-brand-primary">{title}</h1>
    <p>This page is under construction.</p>
    <div className="mt-4 flex flex-col gap-2">
      <Link to="/" className="text-brand-accent hover:underline">
        Marketing Page
      </Link>
      <Link to="/auth" className="text-brand-accent hover:underline">
        Login / Signup
      </Link>
      <Link to="/johndoe" className="text-brand-accent hover:underline">
        Public Profile (John Doe)
      </Link>
      <Link
        to="/dashboard/updates"
        className="text-brand-accent hover:underline"
      >
        Dashboard Updates
      </Link>
    </div>
  </div>
);

const DashboardRoutes = () => (
  <DashboardProvider>
    <Routes>
      <Route index element={<Navigate to="profile" replace />} />
      <Route path="updates" element={<UpdatesEditor />} />
      <Route path="links" element={<LinksEditor />} />
      <Route path="featured" element={<ShowcaseEditor />} />
      <Route path="analytics" element={<AnalyticsEditor />} />
      <Route path="support" element={<HelpAndSupport />} />
      <Route path="settings" element={<SettingsEditor />} />
      <Route path="profile" element={<ProfileEditor />} />
    </Routes>
  </DashboardProvider>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/auth" element={<AuthForms />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route path="/admin/*" element={<DashboardRoutes />} />

          <Route path="/:username" element={<PublicProfilePage />} />
          {/* Fallback for undefined routes */}
          <Route path="*" element={<Placeholder title="404 Not Found" />} />
        </Routes>
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
