import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card } from "../shared/Card";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  alltimeAnalytics,
  timeSeriesAnalytics,
} from "../../service/analyticsServices";

export const AnalyticsEditor = () => {
  const [timeframe, setTimeframe] = useState("7");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalClicks: 0,
    totalViews: 0,
    clicksByDay: [],
    viewsByDay: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [allTime, timeSeries] = await Promise.all([
          alltimeAnalytics(),
          timeSeriesAnalytics(timeframe),
        ]);
        let rawClicks = timeSeries?.clicksByDay || [];
        let rawViews = timeSeries?.profileViewsByDay || [];

        // Fill with default 0s if completely empty
        const days = parseInt(timeframe, 10);
        if (rawClicks.length === 0) {
          for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            rawClicks.push({ date: d.toISOString().split("T")[0], count: 0 });
          }
        }
        if (rawViews.length === 0) {
          for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            rawViews.push({ date: d.toISOString().split("T")[0], count: 0 });
          }
        }

        // Fix centering issue for 1-day data by prepending an empty data point for the previous day
        if (rawClicks.length === 1) {
          const firstDate = new Date(rawClicks[0].date);
          firstDate.setDate(firstDate.getDate() - 1);
          rawClicks = [
            { date: firstDate.toISOString().split("T")[0], count: 0 },
            ...rawClicks,
          ];
        }
        if (rawViews.length === 1) {
          const firstDate = new Date(rawViews[0].date);
          firstDate.setDate(firstDate.getDate() - 1);
          rawViews = [
            { date: firstDate.toISOString().split("T")[0], count: 0 },
            ...rawViews,
          ];
        }

        setAnalyticsData({
          totalClicks: allTime.stats?.totalClicks || 0,
          totalViews: allTime.stats?.totalViews || 0,
          clicksByDay: rawClicks,
          viewsByDay: rawViews,
        });
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  const displayClicks = analyticsData.totalClicks;
  const displayViews = analyticsData.totalViews;
  const chartClicks = analyticsData.clicksByDay;
  const chartViews = analyticsData.viewsByDay;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const EditorContent = (
    <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-primary">Overview</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-bg-primary border border-brand-primary/10 rounded-lg px-4 py-2 text-text-primary outline-none focus:border-brand-accent transition-colors cursor-pointer"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-text-primary/70 text-sm font-medium mb-1">
            Total Profile Views
          </div>
          <div className="text-3xl font-bold text-brand-primary">
            {displayViews.toLocaleString()}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-text-primary/70 text-sm font-medium mb-1">
            Total Link Clicks
          </div>
          <div className="text-3xl font-bold text-brand-primary">
            {displayClicks.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-brand-primary mb-6">
          Clicks Overview
        </h2>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="h-64 min-w-150">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartClicks}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-brand-accent)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-brand-accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-brand-secondary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-brand-secondary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-brand-primary)",
                    opacity: 0.5,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-brand-primary)",
                    opacity: 0.5,
                  }}
                />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-brand-accent)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-brand-primary mb-6">
          Profile Views
        </h2>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="h-64 min-w-150">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartViews}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-brand-primary)",
                    opacity: 0.5,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-brand-primary)",
                    opacity: 0.5,
                  }}
                />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  cursor={{
                    fill: "var(--color-brand-secondary)",
                    opacity: 0.05,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-brand-secondary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );

  return <DashboardLayout>{EditorContent}</DashboardLayout>;
};
