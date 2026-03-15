import MonitorLog from "../models/monitorLog.model.js";
import mongoose from "mongoose";
import os from "os";

export const getMonitorLogs = async (req, res) => {
  try {
    const {
      type,
      status,
      page = 1,
      limit = 50,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const logs = await MonitorLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await MonitorLog.countDocuments(query);

    res.status(201).json({
      logs,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalLogs: total,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getSystemHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const systemInfo = {
      status: "healthy",
      uptime: uptime,
      uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor(
        (uptime % 3600) / 60
      )}m`,
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        processUsage: memoryUsage,
      },
      cpu: {
        model: os.cpus()[0].model,
        cores: os.cpus().length,
        loadAverage: os.loadavg(),
      },
      platform: os.platform(),
      nodeVersion: process.version,
      timestamp: new Date(),
    };

    await MonitorLog.create({
      type: "server",
      status: "healthy",
      message: "System health check",
      metadata: systemInfo,
    });

    res.status(201).json({ systemInfo, message: true });
  } catch (error) {
    await MonitorLog.create({
      type: "server",
      status: "critical",
      message: "System health check failed",
      errorDetails: { message: error.message, stack: error.stack },
    });

    res.status(500).json({ message: error.message, success: false });
  }
};

export const getDatabaseHealth = async (req, res) => {
  try {
    const startTime = Date.now();

    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    await mongoose.connection.db.admin().ping();

    const responseTime = Date.now() - startTime;

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    const dbStats = await mongoose.connection.db.stats();

    const databaseInfo = {
      status: dbState === 1 ? "healthy" : "critical",
      state: dbStateMap[dbState],
      responseTime: `${responseTime}ms`,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: collections.length,
      stats: {
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize,
        objects: dbStats.objects,
      },
      timestamp: new Date(),
    };

    await MonitorLog.create({
      type: "database",
      status: dbState === 1 ? "healthy" : "critical",
      message: "Database health check",
      responseTime,
      metadata: databaseInfo,
    });

    res.status(201).json({ databaseInfo, message: true });
  } catch (error) {
    await MonitorLog.create({
      type: "database",
      status: "critical",
      message: "Database health check failed",
      errorDetails: { message: error.message, stack: error.stack },
    });

    res.status(500).json({ message: error.message, success: false });
  }
};

export const getApiStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = { type: "api" };

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const stats = await MonitorLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          avgResponseTime: { $avg: "$responseTime" },
          minResponseTime: { $min: "$responseTime" },
          maxResponseTime: { $max: "$responseTime" },
          successfulRequests: {
            $sum: { $cond: [{ $lt: ["$statusCode", 400] }, 1, 0] },
          },
          failedRequests: {
            $sum: { $cond: [{ $gte: ["$statusCode", 400] }, 1, 0] },
          },
        },
      },
    ]);

    const statusCodeDistribution = await MonitorLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$statusCode",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const endpointStats = await MonitorLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { endpoint: "$endpoint", method: "$method" },
          count: { $sum: 1 },
          avgResponseTime: { $avg: "$responseTime" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(201).json({
      summary: stats[0] || {
        totalRequests: 0,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        successfulRequests: 0,
        failedRequests: 0,
      },
      statusCodeDistribution,
      topEndpoints: endpointStats,
      timestamp: new Date(),
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
