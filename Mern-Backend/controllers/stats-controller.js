import Bug from "../models/bug.js";

export async function getStatusOverview(req, res) {
  try {
    const range = req.query.range || "30d"; // default: last 30 days

    let days;
    if (range === "7d") days = 7;
    else if (range === "30d") days = 30;
    else if (range === "90d") days = 90;
    else days = 30; // fallback

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const userId = req.user._id;

    //status count
    const statusOverview = await Bug.aggregate([
      {
        $match: {
          createdBy: userId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(statusOverview);

    //count by area
    const areaOverview = await Bug.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $group: {
          _id: "$area",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(areaOverview);

    //count by tag
    const tagsOverview = await Bug.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(tagsOverview);

    // 4) Total time spent
    const timeStats = await Bug.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: "$timeSpent" },
        },
      },
    ]);

    console.log(timeStats);

    //count by bug fixed over time by day
    const FixedByDayOverview = await Bug.aggregate([
      {
        $match: {
          createdBy: userId,
          status: "fixed",
          resolvedAt: { $ne: null },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m-%Y", date: "$resolvedAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(FixedByDayOverview);

    res.json({
      statusOverview,
      areaOverview,
      tagsOverview,
      totalTimeSpent: timeStats[0]?.totalTime || 0,
      FixedByDayOverview,
    });
  } catch (error) {
    res.json("not working fine");
  }
}
