import Bug from "../models/bug.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

function hasMissingBugId(doc) {
  return !doc.bugId || String(doc.bugId).trim() === "";
}

async function createUniqueBugId() {
  while (true) {
    const id = nanoid(8);
    const exists = await Bug.exists({ bugId: id });
    if (!exists) return id;
  }
}

async function backfillMissingBugIds() {
  const missing = await Bug.find({
    $or: [{ bugId: { $exists: false } }, { bugId: null }, { bugId: "" }],
  });

  for (const bug of missing) {
    bug.bugId = await createUniqueBugId();
    await bug.save();
  }
}

//create bug
export async function createBug(req, res) {
  try {
    const payload = { ...req.body, createdBy: req.user._id };

    if (hasMissingBugId(payload)) {
      payload.bugId = await createUniqueBugId();
    }

    const bug = await Bug.create(payload);
    res.status(201).json(bug);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

//get all bugs
export const getBugs = async (req, res) => {
  try {
    await backfillMissingBugIds();

    const {
      status,
      search,
      priority,
      sort,
      archived,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (archived === "true") filter.archived = true;
    if (archived === "false") filter.archived = false;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort) {
      const field = String(sort).startsWith("-")
        ? String(sort).slice(1)
        : String(sort);
      const direction = String(sort).startsWith("-") ? -1 : 1;
      sortOption = { [field]: direction };
    }

    filter.createdBy = req.user._id;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const bugs = await Bug.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Bug.countDocuments(filter);
    const user = await User.findById(req.user._id);

    res.json({
      data: bugs,
      username: user.username,
      email: user.email,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getbug(req, res) {
  try {
    const routeId = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(routeId)
      ? { $or: [{ bugId: routeId }, { _id: routeId }] }
      : { bugId: routeId };

    const bug = await Bug.findOne(query);

    if (!bug) return res.status(404).json({ message: "bug not found" });

    if (hasMissingBugId(bug)) {
      bug.bugId = await createUniqueBugId();
      await bug.save();
    }

    if (bug.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "not allowed" });

    res.json(bug);
  } catch (error) {
    res.json({ error: error.message });
  }
}

//update bug
export async function updateBug(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    //get the bug
    const bug = await Bug.findById(req.params.id);

    //if there is no bug then return
    if (!bug) return res.status(404).json({ message: "bug not found" });

    //if there is bug then check the created by and the sender id same or not
    if (bug.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }

    //if same then update the bug
    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        returnDocument: "after",
        runValidator: true,
      },
    );

    res.json(updatedBug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//delete bug
export async function deleteBug(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const bug = await Bug.findById(req.params.id);

    //if bug is not there
    if (!bug) return res.status(404).json({ message: "bug not found" });

    //check ownership
    if (bug.createdBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "bug not found" });
    }

    //if the bug is approved ownership then delete it
    await bug.deleteOne();

    res.json({ message: "Bug Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Toggle Pin
export async function togglePin(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: "bug not found" });

    if (bug.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }

    bug.pinned = !bug.pinned;
    await bug.save();

    res.json(bug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Toggle Archive
export async function toggleArchive(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: "bug not found" });

    if (bug.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }

    bug.archived = !bug.archived;

    // nice UX: if archiving, unpin it
    if (bug.archived) bug.pinned = false;

    await bug.save();

    res.json(bug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
