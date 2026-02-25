import ArchivedCard from "./ArchivedCard.jsx";
import Leftnav from "./Leftnav.jsx";
import Topnav from "./Topnav.jsx";

export default function Archive() {
  return (
    <div className="w-screen h-screen flex">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav />
        <div className="w-full h-full px-6 py-6 bg-zinc-50">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-zinc-900">Archive</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Archived bugs & closed issues
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <FilterSelect label="All Statuses" />
            <FilterSelect label="All Priorities" />
            <FilterSelect label="Area (e.g. Auth, UI...)" />
            <FilterSelect label="Any Date" />
            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 w-72">
              <span className="text-zinc-400">🔍</span>
              <input
                className="w-full outline-none text-sm text-zinc-700 placeholder:text-zinc-400"
                placeholder="Search archived bugs..."
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArchivedCard
              title="Login button unresponsive on Safari iOS 17.2"
              updated="Last updated 3 days ago"
              tags={["safari", "ios", "auth"]}
            />
            <ArchivedCard
              title="Profile picture not updating for mobile users"
              updated="Last updated 5 days ago"
              tags={["mobile", "profile", "ui"]}
            />
            <ArchivedCard
              title="Prelomating time on reports dashboard"
              updated="Last updated 1 week ago"
              tags={["mobile", "profile", "ui"]}
            />
            <ArchivedCard
              title="Slow loading time on reports dashboard"
              updated="Last updated 1 week ago"
              tags={["performance", "reporting", "charts"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label }) {
  return (
    <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-2 min-w-[180px] text-sm text-zinc-700">
      <span className="truncate">{label}</span>
      <span className="text-zinc-400">▾</span>
    </div>
  );
}
