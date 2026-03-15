import mongoose from "mongoose";

const monitorLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["server", "database", "api", "error"],
    },
    status: {
      type: String,
      required: true,
      enum: ["healthy", "warning", "critical", "down"],
    },
    message: {
      type: String,
      required: true,
    },
    responseTime: {
      type: Number,
    },
    endpoint: {
      type: String,
    },
    method: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    errorDetails: {
      type: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

monitorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const MonitorLog = mongoose.model("MonitorLog", monitorLogSchema);

export default MonitorLog;
