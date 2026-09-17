import e from "express";
import { analytics_eventTable } from "../models/analytics_event.model.js";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import db from "../db/index.js";
import { and, count, eq, gte, sql } from "drizzle-orm";

const router = e.Router();

const getAnalyticsByDay = async (user_id, event_type, daysAgo) => {
  const fromDay = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  return await db
    .select({
      date: sql`DATE_TRUNC('day', ${analytics_eventTable.createdAt})`,
      count: count(),
    })
    .from(analytics_eventTable)
    .where(
      and(
        eq(analytics_eventTable.user_id, user_id),
        eq(analytics_eventTable.event_type, event_type),
        gte(analytics_eventTable.createdAt, fromDay),
      ),
    )
    .groupBy(sql`DATE_TRUNC('day', ${analytics_eventTable.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day', ${analytics_eventTable.createdAt})`);
};

router.get("/analytics", requireAuthentication, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const analytics = await db
      .select({
        event_type: analytics_eventTable.event_type,
        total: count(),
      })
      .from(analytics_eventTable)
      .where(eq(analytics_eventTable.user_id, user_id))
      .groupBy(analytics_eventTable.event_type);

    let totalClicks = 0;
    let totalViews = 0;

    for (const row of analytics) {
      if (row.event_type === "click") totalClicks = row.total;
      if (row.event_type === "profile_view") totalViews = row.total;
    }

    res.status(200).json({
      message: "analytics summary fetched successfully",
      stats: { totalClicks: totalClicks, totalViews: totalViews },
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get(
  "/analytics/timeseries/:days",
  requireAuthentication,
  async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const days = req.params.days;

      const [clicksByDay, profileViewsByDay] = await Promise.all([
        getAnalyticsByDay(user_id, "click", days),
        getAnalyticsByDay(user_id, "profile_view", days),
      ]);

      res.status(200).json({
        message: "analytics summary fetched successfully",
        clicksByDay: clicksByDay,
        profileViewsByDay: profileViewsByDay,
      });
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
    }
  },
);

export default router;
