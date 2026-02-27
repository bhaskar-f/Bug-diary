const DRAFTS_KEY = "bugDiaryDrafts";

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function getDrafts() {
  return safeParse(localStorage.getItem(DRAFTS_KEY));
}

export function saveDraft(draft) {
  const drafts = getDrafts();
  const now = new Date().toISOString();
  const id =
    draft.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const normalizedDraft = {
    ...draft,
    id,
    updatedAt: now,
    createdAt:
      drafts.find((item) => item.id === id)?.createdAt || draft.createdAt || now,
  };

  const nextDrafts = drafts.some((item) => item.id === id)
    ? drafts.map((item) => (item.id === id ? normalizedDraft : item))
    : [normalizedDraft, ...drafts];

  localStorage.setItem(DRAFTS_KEY, JSON.stringify(nextDrafts));
  return normalizedDraft;
}

export function deleteDraft(draftId) {
  const drafts = getDrafts().filter((item) => item.id !== draftId);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return drafts;
}

export function clearDrafts() {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify([]));
}
