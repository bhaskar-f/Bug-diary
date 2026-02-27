import { Link, useParams } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import { userContext } from "../utils/UserContext.jsx";
import { bugContext } from "../utils/Mycontext.jsx";

function Section({ title, children }) {
  return (
    <div className="space-y-2 last:mb-15">
      <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
        {title}
      </h3>
      <div className="bg-white px-2">{children}</div>
    </div>
  );
}

function ActionsCard({
  bugId,
  bugTitle,
  isPinned,
  isArchived,
  isResolved,
  actionLoading,
  onTogglePin,
  onResolve,
  onArchive,
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-5">
      <Link
        to={`/${bugId}/edit`}
        state={{ bugTitle }}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center"
      >
        Edit Bug
      </Link>

      <button
        onClick={onTogglePin}
        disabled={actionLoading === "pin" || isArchived}
        className="w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isArchived
          ? "Unarchive to Pin/Unpin"
          : actionLoading === "pin"
          ? "Updating..."
          : isPinned
            ? "Unpin Bug"
            : "Pin Bug"}
      </button>

      <button
        onClick={onResolve}
        disabled={actionLoading === "resolve" || isResolved}
        className="w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isResolved
          ? "Resolved"
          : actionLoading === "resolve"
            ? "Updating..."
            : "Mark as Resolved"}
      </button>

      <button
        onClick={onArchive}
        disabled={actionLoading === "archive"}
        className="w-full border border-red-300 hover:bg-red-50 text-red-600 font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {actionLoading === "archive"
          ? "Updating..."
          : isArchived
            ? "Unarchive Bug"
            : "Close & Archive"}
      </button>
    </div>
  );
}
function DetailsCard({
  status,
  priority,
  env,
  area,
  createdate,
  updatedat,
  ownerName,
}) {
  const statusTone =
    status === "fixed"
      ? "bg-green-50 border-green-200 text-green-700"
      : status === "open"
        ? "bg-red-50 border-red-200 text-red-700"
        : status === "in-progress"
          ? "bg-yellow-50 border-yellow-200 text-yellow-700"
          : "bg-zinc-50 border-zinc-200 text-zinc-700";

  const statusDot =
    status === "fixed"
      ? "bg-emerald-500"
      : status === "open"
        ? "bg-violet-500"
        : status === "in-progress"
          ? "bg-yellow-500"
          : "bg-zinc-400";

  const priorityTone =
    priority === "low"
      ? "bg-green-50 border-green-200 text-green-700"
      : priority === "high"
        ? "bg-orange-50 border-orange-200 text-orange-700"
        : priority === "critical"
          ? "bg-red-50 border-red-200 text-red-700"
          : priority === "mid" || priority === "medium"
            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
            : "bg-zinc-50 border-zinc-200 text-zinc-700";

  const priorityDot =
    priority === "low"
      ? "bg-emerald-500"
      : priority === "high"
        ? "bg-orange-500"
        : priority === "critical"
          ? "bg-red-500"
          : priority === "mid" || priority === "medium"
            ? "bg-yellow-500"
            : "bg-zinc-400";

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5">
      <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">
        Details
      </h3>

      <div className="space-y-3 text-sm mt-5">
        <DetailRow label="Status">
          <span
            className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[.75rem] border ${statusTone}`}
          >
            <span
              className={`w-[7px] h-[7px] rounded-full ${statusDot}`}
            ></span>
            {status}
          </span>
        </DetailRow>

        <DetailRow label="Priority">
          <span
            className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[.75rem] border ${priorityTone}`}
          >
            <span
              className={`w-[7px] h-[7px] rounded-full ${priorityDot}`}
            ></span>
            {priority}
          </span>
        </DetailRow>

        <DetailRow label="Environment">
          <span className="text-zinc-800">{env}</span>
        </DetailRow>

        <DetailRow label="Area">
          <span className="text-zinc-800">{area}</span>
        </DetailRow>

        <DetailRow label="Created On">
          <span className="text-zinc-800">{createdate}</span>
        </DetailRow>
        <DetailRow label="Last Updated">
          <span className="text-zinc-800">{updatedat}</span>
        </DetailRow>

        <DetailRow label="owner">
          <div className="flex items-center gap-2 ">
            <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-semibold">
              U
            </span>
            <span>@{ownerName || "user"}</span>
          </div>
        </DetailRow>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center justify-between -mt-3 py-1.5 border-b-1 border-zinc-200 last:border-b-0">
      <span className="text-zinc-500">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}

// function RelatedBugsCard() {
//   return (
//     <div className="bg-white border border-zinc-200 rounded-xl p-4">
//       <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">
//         Related Bugs
//       </h3>

//       <ul className="space-y-3 text-sm">
//         <li className="flex items-start gap-2 text-zinc-700 hover:text-violet-600 cursor-pointer">
//           <span className="mt-1 w-2 h-2 rounded-full bg-orange-500"></span>
//           Signup form same issue on Firefox
//         </li>

//         <li className="flex items-start gap-2 text-zinc-700 hover:text-violet-600 cursor-pointer">
//           <span className="mt-1 w-2 h-2 rounded-full bg-violet-500"></span>
//           Password reset button no response
//         </li>

//         <li className="flex items-start gap-2 text-zinc-700 hover:text-violet-600 cursor-pointer">
//           <span className="mt-1 w-2 h-2 rounded-full bg-slate-400"></span>
//           Touch events passive listener docs
//         </li>
//       </ul>
//     </div>
//   );
// }

export default function Bugdetails() {
  const { bugId } = useParams();
  const { user } = useContext(userContext);
  const { getBugs } = useContext(bugContext);
  const [actionLoading, setActionLoading] = useState("");
  const [bug, setBug] = useState({
    stepsToReproduce: [],
    screenshots: [],
    tags: [],
    pinned: false,
    archived: false,
  });

  const normalizeArrayField = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return [value];
    return [];
  };

  function timeAgo(dateString) {
    const now = new Date();
    const updated = new Date(dateString);

    const diffMs = now - updated; // difference in ms

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
  }

  function getDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // Months are zero-indexed, so add 1 for standard numbering (1-12)
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    async function getBug() {
      try {
        const bugRes = await api.get(`/bugs/${bugId}`);
        const bugData = bugRes.data;

        setBug({
          ...bugData,
          stepsToReproduce: normalizeArrayField(bugData.stepsToReproduce),
          screenshots: normalizeArrayField(bugData.screenshots),
          tags: normalizeArrayField(bugData.tags),
        });
      } catch (err) {
        console.log("Error fetching bug:", err);
      }
    }

    getBug();
  }, [bugId]);

  async function togglePin() {
    if (!bug._id || bug.archived) return;

    try {
      setActionLoading("pin");
      const response = await api.patch(`/bugs/${bug._id}/pin`);
      const updatedBug = response.data;

      setBug({
        ...updatedBug,
        stepsToReproduce: normalizeArrayField(updatedBug.stepsToReproduce),
        screenshots: normalizeArrayField(updatedBug.screenshots),
        tags: normalizeArrayField(updatedBug.tags),
      });
      await getBugs();
    } catch (error) {
      console.log("Error toggling pin:", error);
    } finally {
      setActionLoading("");
    }
  }

  async function markResolved() {
    if (!bug._id || bug.status === "fixed") return;

    try {
      setActionLoading("resolve");
      const response = await api.put(`/bugs/${bug._id}`, {
        status: "fixed",
        resolvedAt: new Date().toISOString(),
        lastTouchedAt: new Date().toISOString(),
      });
      const updatedBug = response.data;

      setBug({
        ...updatedBug,
        stepsToReproduce: normalizeArrayField(updatedBug.stepsToReproduce),
        screenshots: normalizeArrayField(updatedBug.screenshots),
        tags: normalizeArrayField(updatedBug.tags),
      });
      await getBugs();
    } catch (error) {
      console.log("Error marking resolved:", error);
    } finally {
      setActionLoading("");
    }
  }

  async function toggleArchive() {
    if (!bug._id) return;

    try {
      setActionLoading("archive");
      const response = await api.patch(`/bugs/${bug._id}/archive`);
      const updatedBug = response.data;

      setBug({
        ...updatedBug,
        stepsToReproduce: normalizeArrayField(updatedBug.stepsToReproduce),
        screenshots: normalizeArrayField(updatedBug.screenshots),
        tags: normalizeArrayField(updatedBug.tags),
      });
      await getBugs();
    } catch (error) {
      console.log("Error archiving bug:", error);
    } finally {
      setActionLoading("");
    }
  }

  return (
    <div className="w-screen h-screen flex">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav username={user.username} email={user.email} />
        <div className="p-8  overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex  items-center gap-1.5">
            <a
              href="/"
              className={`text-sm transition-colors hover:text-violet-600 text-zinc-400`}
            >
              Home
            </a>
            <span className={`text-sm text-zinc-400`}>/</span>
            <span className={`text-sm font-medium text-zinc-300}`}>
              {bug.title}
            </span>
          </div>
          <div className="w-full h-full mt-7">
            <div className="firstSection ">
              <span className="text-zinc-400 font-medium">
                Created {timeAgo(bug.createdAt)}
              </span>
              <h1 className="text-[1.5rem] font-bold">{bug.title}</h1>
              <div className="flex items-center gap-3 text-sm mt-4">
                {/* Open */}
                <div
                  className={`flex items-center gap-2 px-4 py-1 rounded-lg border ${
                    bug.status === "fixed"
                      ? "bg-green-50 border-green-200  text-green-700"
                      : bug.status === "open"
                        ? "bg-red-50 border-red-200  text-red-700"
                        : bug.status === "in-progress" &&
                          "bg-yellow-50 border-yellow-200  text-yellow-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      bug.status === "fixed"
                        ? "bg-emerald-500"
                        : bug.status === "open"
                          ? "bg-violet-500"
                          : bug.status === "in-progress" && "bg-yellow-500"
                    }`}
                  ></span>
                  <span className={`font-normal`}>{bug.status}</span>
                </div>

                {/* High */}
                <div
                  className={`flex items-center gap-2 px-4 py-1 rounded-lg border 
                ${
                  bug.priority === "low"
                    ? "bg-green-50 border-green-200  text-green-700"
                    : bug.priority === "high"
                      ? "bg-orange-50 border-orange-200  text-orange-700"
                      : bug.priority === "critical"
                        ? "bg-red-50 border-red-200  text-red-700"
                        : bug.priority === "mid" &&
                          "bg-yellow-50 border-yellow-200  text-yellow-700"
                }
                `}
                >
                  <span
                    className={`w-2 h-2 rounded-full  ${
                      bug.priority === "low"
                        ? "bg-emerald-500"
                        : bug.priority === "high"
                          ? "bg-orange-500"
                          : bug.priority === "mid"
                            ? "bg-yellow-500"
                            : bug.priority === "critical" && "bg-red-500"
                    }`}
                  ></span>
                  <span className="font-normal">{bug.priority}</span>
                </div>

                {/* Production */}
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-green-200 bg-green-50 text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="font-normal">{bug.environment}</span>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                  <span className="font-normal">{bug.area}</span>
                </div>

                {/* Divider */}
                <span className="mx-1 h-6 w-px bg-slate-200"></span>

                {/* Updated */}
                <div className="flex items-center gap-2 text-slate-400">
                  <i className="ri-time-line text-lg"></i>
                  <span className="font-normal">
                    Updated {timeAgo(bug.lastTouchedAt)}
                  </span>
                </div>
              </div>
            </div>
            <hr className="text-zinc-200 mt-15" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5 ">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Sections go here */}
                <Section title="Description">
                  <p className="text-zinc-700 text-[1.04rem] leading-relaxed">
                    {bug.description}
                  </p>
                </Section>
                <Section title="Steps to Reproduce">
                  <ol className="space-y-2 list-decimal list-inside text-zinc-700">
                    {bug.stepsToReproduce.map((str) => (
                      <li>{str}</li>
                    ))}
                  </ol>
                </Section>
                <Section title="Analysis">
                  <p className="text-zinc-700 mb-4">{bug.learn}</p>

                  <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto">
                    {bug.notes}
                  </pre>

                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                    <span>⚠️ {bug.rootCause}</span>
                    <p></p>
                  </div>
                </Section>
                <Section title="Screenshots">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bug.screenshots.map((img, index) => {
                      return (
                        <div
                          key={index}
                          className="border rounded-lg p-4 flex items-center justify-center text-zinc-400"
                        >
                          <img src={img} alt={`"screenshot"+${index + 1}`} />
                        </div>
                      );
                    })}
                  </div>
                </Section>
                <Section title="Resolution">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                    <div className="font-semibold mb-1">✅ Fix Applied</div>
                    <p>{bug.fix}</p>
                    <span className="inline-block mt-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      PR #438 • merged
                    </span>
                  </div>
                </Section>
                <Section title="Tags">
                  <div className="flex flex-wrap gap-2">
                    {bug.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-violet-50 text-violet-700 border border-violet-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <ActionsCard
                  bugId={bugId}
                  bugTitle={bug.title}
                  isPinned={!!bug.pinned}
                  isArchived={!!bug.archived}
                  isResolved={bug.status === "fixed"}
                  actionLoading={actionLoading}
                  onTogglePin={togglePin}
                  onResolve={markResolved}
                  onArchive={toggleArchive}
                />
                <DetailsCard
                  status={bug.status}
                  priority={bug.priority}
                  env={bug.environment}
                  area={bug.area}
                  createdate={getDate(bug.createdAt)}
                  updatedat={timeAgo(bug.lastTouchedAt)}
                  ownerName={user.username}
                />
                {/* <RelatedBugsCard /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
