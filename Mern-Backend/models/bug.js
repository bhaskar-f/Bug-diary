import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bugId: {
      type: String,
      unique: true,
      index: true,
    },
    area: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },

    // 🆕 Diary fields
    environment: {
      type: String,
      enum: ["dev", "staging", "prod"],
      default: "dev",
    },
    stepsToReproduce: [
      {
        type: String,
      },
    ],
    rootCause: {
      type: String,
    },
    impact: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    timeSpent: {
      type: Number, // in minutes or hours (your choice)
      default: 0,
    },
    notes: {
      type: String,
    },

    fix: {
      type: String,
    },
    learn: {
      type: String,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "fixed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "mid", "high", "critical"],
      default: "low",
    },
    tags: [{ type: String }],

    resolvedAt: {
      type: Date,
      default: null,
    },

    lastTouchedAt: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    screenshots: [
      {
        type: String, // store image URL or file path
      },
    ],
  },

  {
    timestamps: true,
  },
);

// 🧠 Update lastTouchedAt on every save
bugSchema.pre("save", function () {
  this.lastTouchedAt = new Date();

  // If status becomes "fixed" and resolvedAt is empty, set it
  if (this.status === "fixed" && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
});

const Bug = mongoose.model("Bug", bugSchema);

export default Bug;
