import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { AnimatePresence, motion } from "framer-motion";
import api from "../utils/axios.jsx";
import { deleteDraft, saveDraft } from "../utils/drafts.js";
import { userContext } from "../utils/UserContext.jsx";
import { bugContext } from "../utils/Mycontext.jsx";

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border-t border-zinc-200 pt-5 mt-5`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full text-left mb-3 group text-zinc-700 hover:text-zinc-900 transition-colors`}
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          className={`shrink-0 text-zinc-400`}
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

function Textarea({ value, onChange, placeholder, rows = 4, mono = false }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none leading-relaxed transition-colors duration-150
       
        bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-violet-400
        `}
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

function TagInput({ tags, setTags }) {
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
      className={`flex flex-wrap gap-1.5 min-h-[42px] px-3 py-2 border rounded-lg transition-colors bg-white border-zinc-200 focus-within:border-violet-400"
      `}
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
              bg-violet-100 text-violet-700 border border-violet-200`}
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
         text-zinc-700 placeholder-zinc-400`}
      />
    </div>
  );
}

export default function Createpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useContext(userContext);
  const { setBugs, getBugs } = useContext(bugContext);

  const [title, setTitle] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const [openPriority, setPriority] = useState(false);
  const [openenvironment, setEnvironment] = useState(false);
  const [status, setStatus] = useState("open");
  const [priority, setPriorityValue] = useState("low");
  const [environment, setEnvironmentValue] = useState("dev");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [notes, setNotes] = useState("");
  const [resolution, setResolution] = useState("");
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftId, setDraftId] = useState("");
  const [draftMessage, setDraftMessage] = useState("");

  const [dragOver, setDragOver] = useState(false);

  function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    setBugs([]);
    navigate("/signin");
  }

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

  useEffect(() => {
    const incomingDraft = location.state?.draft;
    if (!incomingDraft || incomingDraft.type !== "create") return;

    setDraftId(incomingDraft.id || "");
    setTitle(incomingDraft.title || "");
    setStatus(incomingDraft.status || "open");
    setPriorityValue(incomingDraft.priority || "low");
    setEnvironmentValue(incomingDraft.environment || "dev");
    setArea(incomingDraft.area || "");
    setDescription(incomingDraft.description || "");
    setSteps(incomingDraft.steps || "");
    setAnalysis(incomingDraft.analysis || "");
    setNotes(incomingDraft.notes || "");
    setResolution(incomingDraft.resolution || "");
    setTags(Array.isArray(incomingDraft.tags) ? incomingDraft.tags : []);
    setFiles(
      Array.isArray(incomingDraft.screenshots) ? incomingDraft.screenshots : [],
    );
    setDraftMessage("Draft loaded");
  }, [location.state]);

  function handleSaveDraft() {
    const draft = saveDraft({
      id: draftId || undefined,
      type: "create",
      title,
      status,
      priority,
      environment,
      area,
      description,
      steps,
      analysis,
      notes,
      resolution,
      tags,
      screenshots: files.map((item) =>
        typeof item === "string" ? item : item?.name || "",
      ),
    });

    setDraftId(draft.id);
    setDraftMessage("Draft saved");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setDraftMessage("");
    setSubmitError("");
    setSubmitted(false);

    if (!title.trim()) {
      setSubmitError("Title is required");
      return;
    }

    const stepsToReproduce = steps
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      setCreating(true);
      const payload = {
        title: title.trim(),
        status,
        priority,
        environment,
        area: area.trim(),
        description: description.trim(),
        stepsToReproduce,
        rootCause: analysis.trim(),
        notes: notes.trim(),
        fix: resolution.trim(),
        tags: tags.map((tag) => String(tag).trim()).filter(Boolean),
        screenshots: files
          .map((item) => (typeof item === "string" ? item : item?.name || ""))
          .filter(Boolean),
      };

      await api.post("/bugs", payload);
      await getBugs();
      if (draftId) deleteDraft(draftId);
      setSubmitted(true);
      navigate("/");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create bug",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="w-full h-screen flex ">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />
        <div className="p-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5">
            <a
              href="/"
              className={`text-sm transition-colors hover:text-violet-600 text-zinc-400`}
            >
              Home
            </a>
            <span className={`text-sm text-zinc-400`}>/</span>
            <span className={`text-sm font-medium text-zinc-300}`}>
              Create a Bug Page
            </span>
          </div>

          {/* Title */}
          <form onSubmit={handleSubmit} className="mt-5">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Bug"
                className={`w-full bg-transparent text-2xl sm:text-3xl font-bold outline-none border-none leading-snug transition-colors duration-200 text-zinc-900 placeholder-zinc-300 `}
              />
              {title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs mt-1 text-zinc-400`}
                >
                  Draft · unsaved
                </motion.p>
              )}
            </div>
            <div className="w-full mt-5 flex gap-5">
              <div className="relative w-[15%]">
                <label className=" text-sm font-medium text-heading text-zinc-400">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onMouseDown={() => {
                    setOpenStatus((prev) => !prev);
                  }}
                  onBlur={() => setOpenStatus(false)}
                  class={`w-full mt-2.5 cursor-pointer appearance-none px-3 py-2.5 bg-neutral-secondary-medium border border-1 border-zinc-200 hover:border-zinc-300 text-heading text-zinc-800 text-sm rounded-lg focus:outline-none shadow-xs placeholder:text-body focus:border-violet-400 transition-colors `}
                >
                  <option value="open">Open</option>
                  <option value="open">🟣 Open</option>
                  <option value="in-progress">🔵 In Progress</option>
                  <option value="fixed">🟢 Fixed</option>
                </select>
                {/* Custom arrow */}
                <div
                  className={`pointer-events-none absolute right-3 top-[70%] -translate-y-1/2 text-zinc-500   transition-transform duration-200
            ${openStatus ? "rotate-180" : "rotate-0"}
          `}
                >
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
              <div className="relative w-[15%]">
                <label class=" text-sm font-medium text-heading text-zinc-400">
                  Priority
                </label>
                <select
                  id="Priority"
                  value={priority}
                  onChange={(e) => setPriorityValue(e.target.value)}
                  onMouseDown={() => setPriority((prev) => !prev)}
                  onBlur={() => setPriority(false)}
                  class="w-full mt-2.5 cursor-pointer appearance-none px-3 py-2.5 bg-neutral-secondary-medium border border-1 border-zinc-200 text-heading text-zinc-800 text-sm rounded-lg focus:outline-none hover:border-zinc-300 focus:border-violet-400 shadow-xs placeholder:text-body"
                >
                  <option value="low">Low</option>
                  <option value="low">🟢 Low</option>
                  <option value="mid">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="critical">🔴 Critical</option>
                </select>
                {/* Custom arrow */}
                <div
                  className={`pointer-events-none absolute right-3 top-[70%] -translate-y-1/2 text-zinc-500   transition-transform duration-200
            ${openPriority ? "rotate-180" : "rotate-0"}
          `}
                >
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
              <div className="relative w-[17%]">
                <label className=" text-sm font-medium text-heading text-zinc-400">
                  Environment
                </label>
                <select
                  id="status"
                  value={environment}
                  onChange={(e) => setEnvironmentValue(e.target.value)}
                  onMouseDown={() => setEnvironment((prev) => !prev)}
                  onBlur={() => setEnvironment(false)}
                  class="w-full mt-2.5 cursor-pointer appearance-none px-3 py-2.5 bg-neutral-secondary-medium border border-1 border-zinc-200 text-heading text-zinc-800 text-sm rounded-lg focus:outline-none hover:border-zinc-300 focus:border-violet-400 shadow-xs placeholder:text-body"
                >
                  <option value="dev">Dev</option>
                  <option value="staging">Staging</option>
                  <option value="prod">Production</option>
                </select>
                {/* Custom arrow */}
                <div
                  className={`pointer-events-none absolute right-3 top-[70%] -translate-y-1/2 text-zinc-500   transition-transform duration-200
            ${openenvironment ? "rotate-180" : "rotate-0"}
          `}
                >
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
              <div className="flex flex-col mt-1">
                <span className={`text-sm font-medium text-zinc-400`}>
                  Area
                </span>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Auth, UI…"
                  className={`px-3 py-2.5 mt-2.5 rounded-lg border text-sm outline-none transition-colors duration-150 bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400 hover:border-zinc-300 focus:border-violet-400 shadow-xs`}
                />
              </div>
            </div>
            <div className={`mt-6 border-t pt-5 border-zinc-200`}>
              <span className={`text-sm font-medium block mb-2 text-zinc-400`}>
                Description
              </span>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What went wrong? When does it happen? What did you expect?"
              />
            </div>
            <Section title="Steps to Reproduce">
              <Textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                rows={5}
                placeholder={"1. Go to...\n2. Click on...\n3. Observe that..."}
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
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 border-zinc-200 bg-zinc-50 hover:border-zinc-300 ${dragOver ? "border-violet-400 bg-violet-50" : ""}`}
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
                <p className={`text-sm text-zinc-400`}>
                  <span className="text-violet-600 font-medium">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </p>
                <p className={`text-xs mt-1 text-zinc-400`}>PNG, JPG, GIF</p>
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
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs bg-zinc-50 border-zinc-200 text-zinc-500`}
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
              className={`flex mt-5  items-center justify-between pt-7 border-t border-zinc-200`}
            >
              <p className={`text-xs text-zinc-400`}>
                All fields except title are optional
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className={`px-5 py-2.5 rounded-lg border text-base transition-all duration-150
                     border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300`}
                >
                  Save Draft
                </button>
                <motion.button
                  type="submit"
                  disabled={creating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-base font-medium transition-colors duration-150 shadow-sm shadow-violet-600/20"
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
                        {creating ? "Creating..." : "+ Create a Bug Page"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
            {submitError && (
              <p className="mt-3 text-sm text-red-600">{submitError}</p>
            )}
            {draftMessage && (
              <p className="mt-3 text-sm text-green-600">{draftMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
