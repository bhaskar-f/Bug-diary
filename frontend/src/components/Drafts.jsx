import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { userContext } from "../utils/UserContext.jsx";
import { bugContext } from "../utils/Mycontext.jsx";
import { clearDrafts, deleteDraft, getDrafts } from "../utils/drafts.js";

function timeAgo(dateString) {
  if (!dateString) return "unknown";

  const now = Date.now();
  const time = new Date(dateString).getTime();
  const diffMs = now - time;
  if (Number.isNaN(diffMs) || diffMs < 0) return "unknown";

  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${mins} minute${mins > 1 ? "s" : ""} ago`;
}

export default function Drafts() {
  const navigate = useNavigate();
  const { user, getUser, clearUser } = useContext(userContext);
  const { setBugs } = useContext(bugContext);

  const [drafts, setDrafts] = useState([]);
  const [search, setSearch] = useState("");

  function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    setBugs([]);
    navigate("/signin");
  }

  useEffect(() => {
    const hasToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!hasToken) {
      removeToken();
      return;
    }

    if (!user.username) getUser();
    setDrafts(getDrafts());
  }, []);

  const filteredDrafts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...drafts]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .filter((draft) => {
        if (!query) return true;
        return (
          draft.title?.toLowerCase().includes(query) ||
          draft.type?.toLowerCase().includes(query) ||
          draft.area?.toLowerCase().includes(query)
        );
      });
  }, [drafts, search]);

  function openDraft(draft) {
    if (draft.type === "edit" && draft.bugId) {
      navigate(`/${draft.bugId}/edit`, { state: { draft } });
      return;
    }

    navigate("/create", { state: { draft } });
  }

  function removeDraft(draftId) {
    setDrafts(deleteDraft(draftId));
  }

  function removeAllDrafts() {
    clearDrafts();
    setDrafts([]);
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 lg:h-screen lg:flex lg:overflow-hidden">
      <Leftnav />
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />

        <div className="flex-1 min-h-0 w-full overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h1 className="text-2xl font-semibold">Drafts</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Saved drafts from Create and Edit pages
              </p>
            </div>
            <div className="text-sm text-zinc-500">
              {filteredDrafts.length} draft
              {filteredDrafts.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drafts..."
              className="w-full sm:w-80 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={removeAllDrafts}
              className="w-full sm:w-auto rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            {filteredDrafts.length === 0 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-5 text-zinc-500">
                No drafts found.
              </div>
            )}

            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 truncate">
                      {draft.title?.trim() || "Untitled draft"}
                    </h3>
                    <span className="text-[11px] uppercase rounded border border-zinc-300 px-2 py-0.5 text-zinc-600">
                      {draft.type}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 mt-1">
                    Updated {timeAgo(draft.updatedAt)}
                    {draft.bugId ? ` • Bug ID: ${draft.bugId}` : ""}
                  </p>

                  <p className="text-sm text-zinc-600 mt-2 line-clamp-2">
                    {draft.description?.trim() || "No description"}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => openDraft(draft)}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 w-full sm:w-auto"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDraft(draft.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
