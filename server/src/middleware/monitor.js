import MonitorLog from "../models/monitorLog.model.js";

export const monitorRequest = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const responseTime = Date.now() - start;

    const status =
      res.statusCode < 400
        ? "healthy"
        : res.statusCode < 500
        ? "warning"
        : "critical";

    try {
      await MonitorLog.create({
        type: "api",
        status,
        message: `${req.method} ${req.originalUrl}`,
        responseTime,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        metadata: {
          userAgent: req.get("user-agent"),
          ip: req.ip,
        },
      });
    } catch (error) {
      console.error("Failed to log monitor data:", error);
    }
  });

  next();
};
