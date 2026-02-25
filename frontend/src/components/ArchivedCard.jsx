export default function ArchivedCard({ title, updated, tags }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs rounded-full bg-zinc-100 text-zinc-600">
            Archived
          </span>
          <span className="text-zinc-400">•••</span>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-24 h-16 bg-zinc-100 rounded-md flex-shrink-0"></div>

          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900 text-sm mb-1 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 mb-3">{updated}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 text-zinc-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
          <button className="px-4 py-2 text-sm border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50">
            Restore
          </button>

          <button className="px-4 py-2 text-sm border border-red-200 rounded-lg text-red-500 hover:bg-red-50 flex items-center gap-2">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
