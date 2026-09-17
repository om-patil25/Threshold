import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "../utils/toast";
import { fetchLinks } from "../service/linkServices";
import { fetchUpdates } from "../service/updatesServices";
import { fetchShowcaseItems } from "../service/showcaseItmesServices";
import { getAdminUser } from "../service/userServices";
import { useNavigate } from "react-router-dom";

const DashboardContext = createContext();

export const useDashboard = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userRes = await getAdminUser();
      setUser(userRes.user);

      const [linksData, updatesData, showcaseData] = await Promise.all([
        fetchLinks().catch(() => []),
        fetchUpdates().catch(() => []),
        fetchShowcaseItems().catch(() => []),
      ]);

      // Helper function to sort by date descending (newest first)
      const sortByDateDesc = (arr, dateField = 'createdAt') => {
        return [...arr].sort((a, b) => new Date(b[dateField] || 0) - new Date(a[dateField] || 0));
      };

      setLinks(sortByDateDesc(linksData.links || []));
      setUpdates(sortByDateDesc(updatesData.updates || []));
      setShowcase(sortByDateDesc(showcaseData.files || []));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast("Please log in to access the dashboard.");
      navigate("/auth?mode=login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const value = {
    user,
    setUser,
    links,
    setLinks,
    updates,
    setUpdates,
    showcase,
    setShowcase,
    loading,
    refreshData: fetchDashboardData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
