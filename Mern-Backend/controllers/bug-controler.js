import Bug from "../models/bug.js";
import User from "../models/user.js";

//create bug
export async function createBug(req, res) {
  try {
    const bug = await Bug.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(bug);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

//get all bugs
export const getBugs = async (req, res) => {
  try {
    const { status, search, priority, sort, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = { createdAt: -1 };

    if (sort) sortOption = sort;

    filter.createdBy = req.user._id;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    console.log("FILTER:", filter);

    const bugs = await Bug.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Bug.countDocuments(filter);
    const user = await User.findById(req.user._id);
    console.log(user);

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

//update bug
export async function updateBug(req, res) {
  try {
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
