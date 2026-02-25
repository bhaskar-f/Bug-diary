import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

// ─── Theme Context (matches homepage sidebar dark / content white) ────────────
const ThemeCtx = createContext("light"); // "light" | "dark"

// ─── Data ─────────────────────────────────────────────────────────────────────
const statusOptions = ["Open", "In Progress", "Resolved", "Closed", "Wontfix"];
const priorityOptions = ["Critical", "High", "Medium", "Low"];
const envOptions = ["Production", "Staging", "Dev", "Local"];

const priorityMeta = {
  Critical: {
    dot: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
  High: {
    dot: "bg-orange-500",
    text: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  Medium: {
    dot: "bg-yellow-500",
    text: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
  },
  Low: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
};
const statusMeta = {
  Open: {
    dot: "bg-violet-500",
    text: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
  },
  "In Progress": {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  Resolved: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  Closed: {
    dot: "bg-zinc-400",
    text: "text-zinc-600",
    bg: "bg-zinc-100 border-zinc-200",
  },
  Wontfix: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
  },
};

// ─── Sidebar nav items (matching homepage) ────────────────────────────────────
const navItems = [
  { icon: "⊞", label: "Home", href: "/" },
  { icon: "⊟", label: "Archive", href: "/archive" },
  { icon: "⊡", label: "DashBoard", href: "/dashboard" },
];
const myBugs = [
  "This is the first bug",
  "This is the second bug",
  "This is the third bug",
];

// ─── Custom Select ────────────────────────────────────────────────────────────
function CustomSelect({ label, options, value, onChange, meta }) {
  const theme = useContext(ThemeCtx);
  const dark = theme === "dark";
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const m = meta?.[value];
  const btnCls = dark
    ? "bg-[#1e1e24] border-[#2e2e36] text-zinc-200 hover:border-[#3a3a45]"
    : "bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300";
  const dropCls = dark
    ? "bg-[#1a1a20] border-[#2e2e36] shadow-black/40"
    : "bg-white border-zinc-200 shadow-zinc-200/60";
  const itemCls = dark
    ? "text-zinc-300 hover:bg-[#2a2a32]"
    : "text-zinc-700 hover:bg-zinc-50";

  return (
    <div ref={ref} className="relative flex flex-col gap-1.5">
      <span
        className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-zinc-500"}`}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm z-[99999999999999999] transition-all duration-150 ${btnCls}`}
      >
        <div className="flex items-center gap-2">
          {m && <span className={`w-2 h-2 rounded-full shrink-0 ${m.dot}`} />}
          <span>{value}</span>
        </div>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="opacity-40 shrink-0"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            className={`absolute top-full mt-1 z-50 w-full border rounded-lg shadow-lg overflow-hidden z-[9999999] ${dropCls}`}
          >
            {options.map((opt) => {
              const om = meta?.[opt];
              return (
                <li
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${itemCls} ${value === opt ? "font-medium" : ""}`}
                >
                  {om && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${om.dot}`}
                    />
                  )}
                  {opt}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }) {
  const theme = useContext(ThemeCtx);
  const dark = theme === "dark";
  const [open, setOpen] = useState(defaultOpen);
  const borderCls = dark ? "border-[#2e2e36]" : "border-zinc-200";
  const hdCls = dark
    ? "text-zinc-300 hover:text-white"
    : "text-zinc-700 hover:text-zinc-900";
  const icoCls = dark ? "text-zinc-600" : "text-zinc-400";
  return (
    <div className={`border-t ${borderCls} pt-5`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full text-left mb-3 group ${hdCls} transition-colors`}
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          className={`shrink-0 ${icoCls}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <span className="text-sm font-semibold tracking-wide">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
function Textarea({ value, onChange, placeholder, rows = 4, mono = false }) {
  const theme = useContext(ThemeCtx);
  const dark = theme === "dark";
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none leading-relaxed transition-colors duration-150
        ${
          dark
            ? "bg-[#1e1e24] border-[#2e2e36] text-zinc-200 placeholder-zinc-600 focus:border-violet-500/50"
            : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-violet-400"
        }`}
      style={
        mono
          ? {
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontSize: "13px",
            }
          : {}
      }
    />
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────
function TagInput({ tags, setTags }) {
  const theme = useContext(ThemeCtx);
  const dark = theme === "dark";
  const [input, setInput] = useState("");
  const handleKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) setTags([...tags, input.trim()]);
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length)
      setTags(tags.slice(0, -1));
  };
  return (
    <div
      className={`flex flex-wrap gap-1.5 min-h-[42px] px-3 py-2 border rounded-lg transition-colors
      ${
        dark
          ? "bg-[#1e1e24] border-[#2e2e36] focus-within:border-violet-500/50"
          : "bg-white border-zinc-200 focus-within:border-violet-400"
      }`}
    >
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium
              ${dark ? "bg-violet-500/20 text-violet-300 border border-violet-500/25" : "bg-violet-100 text-violet-700 border border-violet-200"}`}
          >
            #{tag}
            <button
              type="button"
              onClick={() => setTags(tags.filter((x) => x !== tag))}
              className="opacity-50 hover:opacity-100 ml-0.5 transition-opacity"
            >
              ×
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? "Add tag + Enter" : ""}
        className={`flex-1 min-w-[120px] bg-transparent text-sm outline-none
          ${dark ? "text-zinc-300 placeholder-zinc-600" : "text-zinc-700 placeholder-zinc-400"}`}
      />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ theme, setTheme }) {
  return (
    <aside className="w-[230px] shrink-0 bg-[#18181b] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
          🐛
        </div>
        <span className="text-white font-semibold text-[15px]">Bug Diary</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4">
        {navItems.map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${label === "Home" ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <span className="text-base opacity-70">{icon}</span>
            {label}
          </a>
        ))}
      </nav>

      {/* My Bugs */}
      <div className="px-5 pt-2 pb-3">
        <p className="text-xs text-zinc-500 font-medium mb-2">
          My Bugs ({myBugs.length})
        </p>
        <div className="flex flex-col gap-1">
          {myBugs.map((bug) => (
            <a
              key={bug}
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors py-0.5 truncate"
            >
              {bug}
            </a>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle + Help */}
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
        {/* Theme switcher */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-zinc-500">Theme</span>
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            {["light", "dark"].map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setTheme(th)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 capitalize
                  ${theme === th ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-white"}`}
              >
                {th === "light" ? "☀️" : "🌙"} {th}
              </button>
            ))}
          </div>
        </div>

        <a
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="text-base opacity-70">⊙</span>
          Help & Support
        </a>
      </div>
    </aside>
  );
}

// ─── Top Bar (matches homepage top right) ─────────────────────────────────────
function Topbar({ theme }) {
  const dark = theme === "dark";
  return (
    <div
      className={`flex items-center  justify-end gap-2 px-6 py-3 border-b transition-colors duration-300
      ${dark ? "border-[#2e2e36]" : "border-zinc-200"}`}
    >
      <button
        className={`p-2 rounded-lg transition-colors ${dark ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"}`}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 12l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        className={`p-2 rounded-lg transition-colors ${dark ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"}`}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3.5 16c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${dark ? "bg-zinc-700 text-zinc-200" : "bg-zinc-200 text-zinc-700"}`}
      >
        M
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreateBugPage() {
  const [theme, setTheme] = useState("light");
  const dark = theme === "dark";

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Low");
  const [env, setEnv] = useState("Dev");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [notes, setNotes] = useState("");
  const [resolution, setResolution] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.055,
          delay: 0.05,
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFiles((p) => [
      ...p,
      ...Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      ),
    ]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contentBg = dark ? "bg-[#111114]" : "bg-white";
  const pageBg = dark ? "bg-[#0d0d10]" : "bg-[#f3f4f6]";
  const labelCls = dark ? "text-zinc-400" : "text-zinc-500";
  const inputCls = dark
    ? "bg-[#1e1e24] border-[#2e2e36] text-zinc-200 placeholder-zinc-600 focus:border-violet-500/50"
    : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-violet-400";
  const borderCls = dark ? "border-[#2e2e36]" : "border-zinc-200";
  const titleCls = dark
    ? "text-white placeholder-zinc-700"
    : "text-zinc-900 placeholder-zinc-300";
  const subtextCls = dark ? "text-zinc-500" : "text-zinc-400";
  const dropzoneCls = dark
    ? `border-[#2e2e36] bg-[#1a1a20] hover:border-[#3a3a45] ${dragOver ? "border-violet-500/60 bg-violet-500/5" : ""}`
    : `border-zinc-200 bg-zinc-50 hover:border-zinc-300 ${dragOver ? "border-violet-400 bg-violet-50" : ""}`;

  return (
    <ThemeCtx.Provider value={theme}>
      <div
        className={`flex min-h-screen w-full overflow-x-hidden  transition-colors duration-300 ${pageBg}`}
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* ── Sidebar (always dark, matches homepage) ── */}
        <Sidebar theme={theme} setTheme={setTheme} />

        {/* ── Main column ── */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-colors duration-300 ${contentBg}`}
        >
          <Topbar theme={theme} />

          <main className="flex-1 px-6 sm:px-8 py-7 overflow-y-auto">
            <form
              ref={contentRef}
              onSubmit={handleSubmit}
              className="max-w-2xl flex flex-col gap-6"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5">
                <a
                  href="/"
                  className={`text-sm transition-colors hover:text-violet-600 ${subtextCls}`}
                >
                  Home
                </a>
                <span className={`text-sm ${subtextCls}`}>/</span>
                <span
                  className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-zinc-700"}`}
                >
                  Create a Bug Page
                </span>
              </div>

              {/* Title */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Bug"
                  className={`w-full bg-transparent text-2xl sm:text-3xl font-bold outline-none border-none leading-snug transition-colors duration-200 ${titleCls}`}
                />
                {title && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs mt-1 ${subtextCls}`}
                  >
                    Draft · unsaved
                  </motion.p>
                )}
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <CustomSelect
                  label="Status"
                  options={statusOptions}
                  value={status}
                  onChange={setStatus}
                  meta={statusMeta}
                />
                <CustomSelect
                  label="Priority"
                  options={priorityOptions}
                  value={priority}
                  onChange={setPriority}
                  meta={priorityMeta}
                />
                <CustomSelect
                  label="Environment"
                  options={envOptions}
                  value={env}
                  onChange={setEnv}
                />
                <div className="flex flex-col gap-1.5">
                  <span className={`text-xs font-medium ${labelCls}`}>
                    Area
                  </span>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Auth, UI…"
                    className={`px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-150 ${inputCls}`}
                  />
                </div>
              </div>

              {/* Description */}
              <div className={`border-t pt-5 ${borderCls}`}>
                <span className={`text-xs font-medium block mb-2 ${labelCls}`}>
                  Description
                </span>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="What went wrong? When does it happen? What did you expect?"
                />
              </div>

              {/* Steps */}
              <Section title="Steps to Reproduce">
                <Textarea
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={5}
                  mono
                  placeholder={
                    "1. Go to...\n2. Click on...\n3. Observe that..."
                  }
                />
              </Section>

              {/* Analysis */}
              <Section title="Analysis">
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={analysis}
                    onChange={(e) => setAnalysis(e.target.value)}
                    rows={4}
                    placeholder="Root cause, relevant code, hypothesis…"
                  />
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Notes, related issues, links…"
                  />
                </div>
              </Section>

              {/* Resolution */}
              <Section title="Resolution" defaultOpen={false}>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  placeholder="Fix description, PR link, commit hash…"
                />
              </Section>

              {/* Screenshots */}
              <Section title="Screenshots">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input").click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 ${dropzoneCls}`}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setFiles((p) => [...p, ...Array.from(e.target.files)])
                    }
                  />
                  <p className={`text-sm ${subtextCls}`}>
                    <span className="text-violet-600 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className={`text-xs mt-1 ${subtextCls}`}>PNG, JPG, GIF</p>
                </div>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${dark ? "bg-[#1e1e24] border-[#2e2e36] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-500"}`}
                      >
                        <span>🖼</span>
                        <span className="max-w-[110px] truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFiles(files.filter((_, j) => j !== i))
                          }
                          className="opacity-50 hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </Section>

              {/* Tags */}
              <Section title="Tags">
                <TagInput tags={tags} setTags={setTags} />
              </Section>

              {/* Actions — purple button matches homepage CTA */}
              <div
                className={`flex items-center justify-between pt-5 border-t ${borderCls}`}
              >
                <p className={`text-xs ${subtextCls}`}>
                  All fields except title are optional
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border text-sm transition-all duration-150
                      ${
                        dark
                          ? "border-[#2e2e36] text-zinc-400 hover:text-zinc-200 hover:border-[#3a3a45]"
                          : "border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                      }`}
                  >
                    Save Draft
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors duration-150 shadow-sm shadow-violet-600/20"
                  >
                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.span
                          key="ok"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5"
                        >
                          ✓ Created!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="go"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5"
                        >
                          + Create a Bug Page
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </form>
          </main>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          html, body { overflow-x: hidden; max-width: 100%; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #52525b; }
        `}</style>
      </div>
    </ThemeCtx.Provider>
  );
}
