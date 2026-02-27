// seedBugs.js
import mongoose from "mongoose";
import Bug from "./models/bug.js"; // adjust path
import User from "./models/user.js"; // adjust path
import { nanoid } from "nanoid";

import dotenv from "dotenv";
dotenv.config();

const titles = [
  "Crash on login",
  "Navbar not responsive",
  "Memory leak in worker",
  "Button double submits",
  "Infinite loading spinner",
  "Wrong API base URL in prod",
  "CSS breaks on Safari",
  "Search returns empty",
  "Pagination off by one",
  "Dark mode flicker",
  "File upload fails",
  "Token expires too early",
  "Modal not closing",
  "Form validation skipped",
  "Images not caching",
];

const areas = [
  "Auth",
  "Dashboard",
  "Settings",
  "Bug List",
  "Editor",
  "Upload",
  "Search",
  "UI",
  "API",
  "Database",
];

const descriptions = [
  "App crashes under specific conditions.",
  "UI behaves incorrectly on smaller screens.",
  "Request fails without clear error message.",
  "Unexpected state update causes rerender loop.",
  "Feature works in dev but not in prod.",
];

const steps = [
  "Open the app and go to login page",
  "Click the submit button twice quickly",
  "Refresh the page",
  "Switch to dark mode",
  "Open the modal and close it",
];

const rootCauses = [
  "Missing dependency in useEffect",
  "Wrong environment variable",
  "Race condition in async call",
  "Improper state mutation",
  "API response shape changed",
  "CSS specificity issue",
];

const fixes = [
  "Added missing dependency",
  "Fixed env variable",
  "Debounced the handler",
  "Refactored state update",
  "Updated API parsing logic",
  "Adjusted CSS selectors",
];

const learns = [
  "Always test in prod-like env",
  "Avoid side effects in render",
  "Validate API contracts",
  "Write regression tests",
  "Be careful with async state",
];

const tagsPool = [
  "ui",
  "api",
  "auth",
  "performance",
  "bug",
  "urgent",
  "frontend",
  "backend",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr) {
  return arr.filter(() => Math.random() > 0.6);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI); // change this

  // pick any existing user as creator
  const user = await User.findOne();

  console.log(user);
  if (!user) {
    throw new Error("Create a user first, then run this seed.");
  }

  const bugs = [];

  for (let i = 0; i < 50; i++) {
    const statusPool = ["open", "in-progress", "fixed"];
    const priorityPool = ["low", "mid", "high", "critical"];
    const impactPool = ["low", "medium", "high"];
    const envPool = ["dev", "staging", "prod"];

    const status = randomFrom(statusPool);

    bugs.push({
      title: `${randomFrom(titles)} #${i + 1}`,
      area: randomFrom(areas),
      bugId: nanoid(5),
      description: randomFrom(descriptions),
      environment: randomFrom(envPool),
      stepsToReproduce: randomFrom(steps),
      rootCause: randomFrom(rootCauses),
      impact: randomFrom(impactPool),
      timeSpent: Math.floor(Math.random() * 240), // minutes
      notes: "Auto-generated test bug for UI and API testing.",
      fix: randomFrom(fixes),
      learn: randomFrom(learns),
      status,
      priority: randomFrom(priorityPool),
      tags: randomSubset(tagsPool),
      resolvedAt: status === "fixed" ? new Date() : null,
      lastTouchedAt: new Date(),
      createdBy: user._id,
      archived: Math.random() > 0.9,
      pinned: Math.random() > 0.85,
      screenshots: [],
    });
  }

  await Bug.insertMany(bugs);
  console.log("✅ Inserted 50 sample bugs");

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
