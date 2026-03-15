import MonitorLog from "../models/monitorLog.model.js";

export const errorHandler = async (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  try {
    await MonitorLog.create({
      type: "error",
      status: "critical",
      message: err.message,
      endpoint: req.originalUrl,
      method: req.method,
      statusCode,
      errorDetails: {
        stack: err.stack,
        name: err.name,
      },
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
