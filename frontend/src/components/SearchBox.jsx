import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { bugContext } from "../utils/Mycontext.jsx";
import { userContext } from "../utils/UserContext.jsx";

const GLOBAL_PAGE_ITEMS = [
  {
    id: "page-home",
    type: "page",
    title: "Home",
    subtitle: "Recent and pinned bugs overview",
    to: "/",
    keywords: "home overview recent pinned welcome",
  },
  {
    id: "page-bugs",
    type: "page",
    title: "All Bug Pages",
    subtitle: "Browse and filter every bug",
    to: "/bug-pages",
    keywords: "all bugs list search filter pages",
  },
  {
    id: "page-create",
    type: "action",
    title: "Create Bug Page",
    subtitle: "Add a new bug entry",
    to: "/create",
    keywords: "create add new bug page report",
  },
  {
    id: "page-archive",
    type: "page",
    title: "Archive",
    subtitle: "View archived bugs",
    to: "/archive",
    keywords: "archive archived closed",
  },
  {
    id: "page-dashboard",
    type: "page",
    title: "Dashboard",
    subtitle: "Bug stats and analytics",
    to: "/dashboard",
    keywords: "dashboard stats analytics charts",
  },
  {
    id: "page-drafts",
    type: "page",
    title: "Drafts",
    subtitle: "Draft and unfinished items",
    to: "/drafts",
    keywords: "draft drafts unfinished work in progress",
  },
];

const MIN_QUERY_LENGTH = 2;
const MAX_VISIBLE_RESULTS = 8;

function asSearchText(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(" ");
  return String(value);
}

function scoreMatch(item, query) {
  const title = item.title.toLowerCase();
  const searchText = item.searchText;

  let score = 0;
  if (title === query) score += 100;
  else if (title.startsWith(query)) score += 80;
  else if (title.includes(query)) score += 50;

  if (searchText.includes(query)) score += 30;
  if (item.type === "page") score += 10;
  if (item.type === "bug" && item.pinned) score += 4;
  if (item.type === "bug" && item.archived) score -= 2;

  return score;
}

export default function SearchBox() {
  const inputWrapRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { bugs } = useContext(bugContext);
  const { user } = useContext(userContext);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const pageItems = useMemo(() => {
    const profileItem = {
      id: "user-profile",
      type: "action",
      title: "My Profile",
      subtitle: user?.email || "Account settings from top-right menu",
      to: "/",
      keywords: `profile settings account ${user?.username || ""} ${user?.email || ""}`,
    };

    return [...GLOBAL_PAGE_ITEMS, profileItem].map((item) => ({
      ...item,
      searchText:
        `${item.title} ${item.subtitle} ${item.keywords || ""}`.toLowerCase(),
    }));
  }, [user?.username, user?.email]);

  const bugItems = useMemo(() => {
    return [...bugs]
      .map((bug) => {
        const bugKey = bug.bugId || bug._id;
        if (!bugKey) return null;

        const searchText = [
          bug.title,
          bug.description,
          bug.area,
          bug.status,
          bug.priority,
          bug.environment,
          bug.rootCause,
          bug.fix,
          bug.learn,
          bug.notes,
          asSearchText(bug.tags),
          asSearchText(bug.stepsToReproduce),
          asSearchText(bug.screenshots),
          bug.archived ? "archived closed" : "active open",
          bug.pinned ? "pinned important" : "",
        ]
          .map(asSearchText)
          .join(" ")
          .toLowerCase();

        return {
          id: `bug-${bug._id || bug.bugId}`,
          type: "bug",
          title: bug.title || "Untitled bug",
          subtitle: `${bug.status || "open"} | ${bug.priority || "low"} | ${bug.area || "general"}`,
          to: `/${bugKey}/bugdetails`,
          searchText,
          archived: !!bug.archived,
          pinned: !!bug.pinned,
          updatedAt: bug.updatedAt,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [bugs]);

  const normalizedQuery = query.trim().toLowerCase();

  const { filteredPages, filteredBugs } = useMemo(() => {
    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      return {
        filteredPages: [],
        filteredBugs: [],
      };
    }

    const matchAndSort = (items, limit) =>
      items
        .filter((item) => item.searchText.includes(normalizedQuery))
        .map((item) => ({ ...item, score: scoreMatch(item, normalizedQuery) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return {
      filteredPages: matchAndSort(pageItems, 3),
      filteredBugs: matchAndSort(bugItems, 8),
    };
  }, [normalizedQuery, pageItems, bugItems]);

  const resultItems = useMemo(
    () => [...filteredPages, ...filteredBugs],
    [filteredPages, filteredBugs],
  );
  const displayedResults = useMemo(
    () => resultItems.slice(0, MAX_VISIBLE_RESULTS),
    [resultItems],
  );
  const shouldShowSuggestions =
    open && normalizedQuery.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    setHighlightedIndex(0);
  }, [normalizedQuery, open]);

  const closeSearch = () => {
    gsap.to(inputWrapRef.current, {
      scaleX: 0,
      duration: 0.25,
      ease: "power3.in",
      transformOrigin: "right center",
      onComplete: () => {
        gsap.set(inputWrapRef.current, { display: "none" });
      },
    });

    setOpen(false);
    setQuery("");
    setHighlightedIndex(0);
  };

  useEffect(() => {
    if (!open) return;

    const closeOnOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const openSearch = () => {
    if (open) return;

    gsap.set(inputWrapRef.current, { display: "block" });
    gsap.fromTo(
      inputWrapRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.35,
        ease: "power3.out",
        transformOrigin: "right center",
        onComplete: () => inputRef.current?.focus(),
      },
    );

    setOpen(true);
  };

  useEffect(() => {
    const openShortcut = (event) => {
      const tagName = event.target?.tagName?.toLowerCase();
      const isTypingField =
        tagName === "input" ||
        tagName === "textarea" ||
        event.target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (!isTypingField && event.key === "/") {
        event.preventDefault();
        openSearch();
      }
    };

    document.addEventListener("keydown", openShortcut);
    return () => document.removeEventListener("keydown", openShortcut);
  }, []);

  const toggleSearch = () => {
    if (!open) openSearch();
    else closeSearch();
  };

  const handleNavigate = (item) => {
    if (!item?.to) return;
    navigate(item.to);
    closeSearch();
  };

  const handleInputKeyDown = (event) => {
    if (!displayedResults.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % displayedResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? displayedResults.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleNavigate(displayedResults[highlightedIndex]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative group flex items-center justify-end gap-1.5"
    >
      <div
        ref={inputWrapRef}
        style={{ display: "none" }}
        className="origin-right relative"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search bugs and pages..."
          className="h-8 w-[12rem] sm:w-[15rem] md:w-[18.5rem] px-3.5 border border-zinc-300 rounded-full outline-none text-sm"
        />

        {open && normalizedQuery.length > 0 && normalizedQuery.length < 2 && (
          <div className="absolute top-[calc(100%+0.35rem)] right-2 text-[11px] text-zinc-400">
            Type at least 2 characters
          </div>
        )}

        {shouldShowSuggestions && (
          <div className="absolute top-[calc(100%+0.45rem)] right-0 z-[99990] w-[16rem] sm:w-[19rem] md:w-[22rem] rounded-lg border border-zinc-200 bg-white shadow-lg overflow-hidden">
            <div className="max-h-[16.5rem] overflow-y-auto p-1.5">
              {displayedResults.length === 0 ? (
                <div className="px-2 py-6 text-center text-[0.82rem] text-zinc-500">
                  No results found for "{query.trim()}".
                </div>
              ) : (
                <div className="space-y-1">
                  {displayedResults.map((item, index) => {
                    const isActive = highlightedIndex === index;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => handleNavigate(item)}
                        className={`w-full rounded-md px-2 py-1.5 text-left transition-colors ${
                          isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[0.84rem] font-medium text-zinc-800 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] uppercase text-zinc-400 shrink-0">
                            {item.type === "bug" ? "Bug" : "Page"}
                          </span>
                        </div>
                        <p className="text-[0.7rem] text-zinc-500 truncate mt-[1px]">
                          {item.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={toggleSearch}
        className="h-8 w-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-zinc-100"
      >
        {open ? (
          <span className="text-xl leading-none">
            <i className="ri-close-fill"></i>
          </span>
        ) : (
          <span className="text-xl leading-none">
            <i className="ri-search-line"></i>
          </span>
        )}
      </button>

      <div className="pointer-events-none absolute top-[115%] right-0 z-[99999] mt-2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hidden sm:block">
        {open ? "Close" : "Search (Ctrl+K or /)"}
      </div>
    </div>
  );
}
