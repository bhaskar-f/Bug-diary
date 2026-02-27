import { Link } from "react-router-dom";

function timeAgo(dateString) {
  if (!dateString) return "Unknown";

  const now = new Date();
  const updated = new Date(dateString);
  const diffMs = now - updated;

  if (Number.isNaN(diffMs) || diffMs < 0) return "Unknown";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
}

export default function ArchivedCard({ bug, onRestore, onDelete, busy }) {
  const tags = bug.tags || [];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs rounded-full bg-zinc-100 text-zinc-600">
            Archived
          </span>
          <span className="text-xs text-zinc-500">{bug.priority || "low"}</span>
        </div>

        <div className="flex gap-4">
          <div className="w-24 h-16 bg-zinc-100 rounded-md flex-shrink-0 overflow-hidden">
            {typeof bug.screenshots?.[0] === "string" && bug.screenshots[0] ? (
              <img
                src={bug.screenshots[0]}
                alt={bug.title}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          <div className="flex-1">
            <Link
              to={`/${bug.bugId}/bugdetails`}
              className="font-semibold text-zinc-900 text-sm mb-1 leading-snug hover:text-violet-700"
            >
              {bug.title}
            </Link>
            <p className="text-xs text-zinc-500 mb-1">
              Last updated {timeAgo(bug.updatedAt)}
            </p>
            <p className="text-xs text-zinc-400 mb-3">{bug.area || "General"}</p>

            <div className="flex flex-wrap gap-2">
              {tags.length ? (
                tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 text-zinc-600"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 text-zinc-500">
                  No tags
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
          <button
            onClick={onRestore}
            disabled={busy}
            className="px-4 py-2 text-sm border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Working..." : "Restore"}
          </button>

          <button
            onClick={onDelete}
            disabled={busy}
            className="px-4 py-2 text-sm border border-red-200 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
