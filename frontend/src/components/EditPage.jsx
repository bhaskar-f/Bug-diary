import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import api from "../utils/axios";
import { bugContext } from "../utils/Mycontext.jsx";
import { userContext } from "../utils/UserContext.jsx";
import { saveDraft } from "../utils/drafts.js";

function normalizeArrayField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function splitSteps(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-zinc-200 pt-5 mt-5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 w-full text-left mb-3 group text-zinc-700 hover:text-zinc-900 transition-colors"
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          className="shrink-0 text-zinc-400"
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
      className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none leading-relaxed transition-colors duration-150 bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-violet-400"
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
      const next = input.trim();
      if (!tags.includes(next)) setTags([...tags, next]);
      setInput("");
    }

    if (e.key === "Backspace" && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[42px] px-3 py-2 border rounded-lg transition-colors bg-white border-zinc-200 focus-within:border-violet-400">
      <AnimatePresence>
        {tags.map((tag, index) => (
          <motion.span
            key={`${tag}-${index}`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200"
          >
            #{tag}
            <button
              type="button"
              onClick={() => setTags(tags.filter((_, i) => i !== index))}
              className="opacity-50 hover:opacity-100 ml-0.5 transition-opacity"
            >
              x
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? "Add tag + Enter" : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none text-zinc-700 placeholder-zinc-400"
      />
    </div>
  );
}

export default function EditPage() {
  const { bugId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { user, clearUser } = useContext(userContext);
  const { getBugs, setBugs } = useContext(bugContext);

  const [mongoId, setMongoId] = useState("");
  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState(
    location.state?.bugTitle || "",
  );
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("low");
  const [environment, setEnvironment] = useState("dev");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [notes, setNotes] = useState("");
  const [resolution, setResolution] = useState("");
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);

  const [openStatus, setOpenStatus] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openEnvironment, setOpenEnvironment] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [draftId, setDraftId] = useState("");
  const [draftMessage, setDraftMessage] = useState("");

  const breadcrumbTitle = title.trim() || originalTitle || "Bug Details";

  function applyIncomingDraft(draft) {
    setDraftId(draft.id || "");
    setTitle(draft.title || "");
    setStatus(draft.status || "open");
    setPriority(draft.priority || "low");
    setEnvironment(draft.environment || "dev");
    setArea(draft.area || "");
    setDescription(draft.description || "");
    setSteps(draft.steps || "");
    setAnalysis(draft.analysis || "");
    setNotes(draft.notes || "");
    setResolution(draft.resolution || "");
    setFiles(
      Array.isArray(draft.screenshots) ? draft.screenshots : normalizeArrayField(draft.screenshots),
    );
    setTags(Array.isArray(draft.tags) ? draft.tags : normalizeArrayField(draft.tags));
    setDraftMessage("Draft loaded");
  }

  function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    setBugs([]);
    navigate("/signin");
  }

  useEffect(() => {
    async function getBug() {
      try {
        setLoading(true);
        const bugRes = await api.get(`/bugs/${bugId}`);
        const bugData = bugRes.data;

        setMongoId(bugData._id || "");
        setOriginalTitle(bugData.title || location.state?.bugTitle || "");
        setTitle(bugData.title || "");
        setStatus(bugData.status || "open");
        setPriority(bugData.priority || "low");
        setEnvironment(bugData.environment || "dev");
        setArea(bugData.area || "");
        setDescription(bugData.description || "");
        setSteps(normalizeArrayField(bugData.stepsToReproduce).join("\n"));
        setAnalysis(bugData.rootCause || "");
        setNotes(bugData.notes || "");
        setResolution(bugData.fix || "");
        setFiles(normalizeArrayField(bugData.screenshots));
        setTags(normalizeArrayField(bugData.tags));

        const incomingDraft = location.state?.draft;
        if (
          incomingDraft &&
          incomingDraft.type === "edit" &&
          (!incomingDraft.bugId || incomingDraft.bugId === bugId)
        ) {
          applyIncomingDraft(incomingDraft);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Error fetching bug",
        );
      } finally {
        setLoading(false);
      }
    }

    if (!bugId) return;
    getBug();
  }, [bugId, location.state]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFiles((prev) => [
      ...prev,
      ...Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      ),
    ]);
  };

  function handleSaveDraft() {
    const draft = saveDraft({
      id: draftId || undefined,
      type: "edit",
      bugId,
      sourceMongoId: mongoId,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!mongoId) {
      setError("Bug is not loaded yet. Please wait.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: title.trim(),
        status,
        priority,
        environment,
        area: area.trim(),
        description: description.trim(),
        stepsToReproduce: splitSteps(steps),
        rootCause: analysis.trim(),
        notes: notes.trim(),
        fix: resolution.trim(),
        tags: normalizeArrayField(tags).map((tag) => String(tag).trim()),
        screenshots: files.filter((item) => typeof item === "string"),
      };

      await api.put(`/bugs/${mongoId}`, payload);
      await getBugs();
      setSubmitted(true);
      navigate(`/${bugId}/bugdetails`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update bug",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <Leftnav />

      <div className="w-[80%] h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />

        <div className="p-8 overflow-y-auto">
          <div className="flex items-center gap-1.5">
            <Link
              to="/"
              className="text-sm transition-colors hover:text-violet-600 text-zinc-400"
            >
              Home
            </Link>
            <span className="text-sm text-zinc-400">/</span>
            <Link
              to={`/${bugId}/bugdetails`}
              className="text-sm transition-colors hover:text-violet-600 text-zinc-400"
            >
              {breadcrumbTitle}
            </Link>
            <span className="text-sm text-zinc-400">/</span>
            <span className="text-sm font-medium text-zinc-300">Edit</span>
          </div>

          {loading ? (
            <div className="mt-8 text-zinc-500">Loading bug data...</div>
          ) : (
            <form className="mt-5" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Bug"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-bold outline-none border-none leading-snug transition-colors duration-200 text-zinc-900 placeholder-zinc-300"
                />
                {title && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs mt-1 text-zinc-400"
                  >
                    Draft - unsaved
                  </motion.p>
                )}
              </div>

              <div className="w-full mt-5 flex gap-5">
                <div className="relative w-[15%]">
                  <label className="text-sm font-medium text-zinc-400">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    onMouseDown={() => setOpenStatus((prev) => !prev)}
                    onBlur={() => setOpenStatus(false)}
                    className="w-full mt-2.5 cursor-pointer appearance-none px-3 py-2.5 border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-sm rounded-lg focus:outline-none shadow-xs focus:border-violet-400 transition-colors"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <div
                    className={`pointer-events-none absolute right-3 top-[70%] -translate-y-1/2 text-zinc-500 transition-transform duration-200 ${
                      openStatus ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </div>

                <div className="relative w-[15%]">
                  <label className="text-sm font-medium text-zinc-400">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    onMouseDown={() => setOpenPriority((prev) => !prev)}
                    onBlur={() => setOpenPriority(false)}
                    className="w-full mt-2.5 cursor-pointer appearance-none px-3 py-2.5 border border-zinc-200 text-zinc-800 text-sm rounded-lg focus:outline-none hover:border-zinc-300 focus:border-violet-400 shadow-xs"
                  >
                    <option value="low">Low</option>
                    <option value="mid">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <div
                    className={`pointer-events-none absolute right-3 top-[70%] -translate-y-1/2 text-zinc-500 transition-transform duration-200 ${
                      openPriority ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </div>

                <div className="relative w-[17%]">
                  <label className="text-sm font-medium text-zinc-400">
                    Environment
                  </label>
                  <select
                    id="environment"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    onMouseDown={() => setOpenEnvironment((prev) => !prev)}
                    onBlur={() => setOpenEnvironment(false)}
                    className="w-full mt-2.5 cursor-pointer appearance-none px-3 py-2.5 border border-zinc-200 text-zinc-800 text-sm rounded-lg focus:outline-none hover:border-zinc-300 focus:border-violet-400 shadow-xs"
                  >
                    <option value="dev">Dev</option>
                    <option value="staging">Staging</option>
                    <option value="prod">Production</option>
                  </select>
                  <div
                    className={`pointer-events-none absolute right-3 top-[70%] -translate-y-1/2 text-zinc-500 transition-transform duration-200 ${
                      openEnvironment ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </div>

                <div className="flex flex-col mt-1">
                  <span className="text-sm font-medium text-zinc-400">Area</span>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Auth, UI..."
                    className="px-3 py-2.5 mt-2.5 rounded-lg border text-sm outline-none transition-colors duration-150 bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400 hover:border-zinc-300 focus:border-violet-400 shadow-xs"
                  />
                </div>
              </div>

              <div className="mt-6 border-t pt-5 border-zinc-200">
                <span className="text-sm font-medium block mb-2 text-zinc-400">
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

              <Section title="Analysis">
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={analysis}
                    onChange={(e) => setAnalysis(e.target.value)}
                    rows={4}
                    placeholder="Root cause, relevant code, hypothesis..."
                  />
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Notes, related issues, links..."
                  />
                </div>
              </Section>

              <Section title="Resolution" defaultOpen={false}>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  placeholder="Fix description, PR link, commit hash..."
                />
              </Section>

              <Section title="Screenshots">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("edit-file-input").click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 border-zinc-200 bg-zinc-50 hover:border-zinc-300 ${
                    dragOver ? "border-violet-400 bg-violet-50" : ""
                  }`}
                >
                  <input
                    id="edit-file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                    }
                  />
                  <p className="text-sm text-zinc-400">
                    <span className="text-violet-600 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs mt-1 text-zinc-400">PNG, JPG, GIF</p>
                </div>

                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {files.map((file, index) => (
                      <div
                        key={`${typeof file}-${index}`}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs bg-zinc-50 border-zinc-200 text-zinc-500"
                      >
                        <span>[img]</span>
                        <span className="max-w-[140px] truncate">
                          {typeof file === "string" ? file : file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((_, itemIndex) => itemIndex !== index),
                            )
                          }
                          className="opacity-50 hover:opacity-100"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </Section>

              <Section title="Tags">
                <TagInput tags={tags} setTags={setTags} />
              </Section>

              <div className="flex mt-5 items-center justify-between pt-7 border-t border-zinc-200">
                <p className="text-xs text-zinc-400">
                  All fields except title are optional
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-2.5 rounded-lg border text-base transition-all duration-150 border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                  >
                    Save Draft
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={saving}
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
                          Updated
                        </motion.span>
                      ) : (
                        <motion.span
                          key="go"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5"
                        >
                          {saving ? "Updating..." : "Update Bug"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
              {draftMessage && (
                <p className="mt-3 text-sm text-green-600">{draftMessage}</p>
              )}

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
