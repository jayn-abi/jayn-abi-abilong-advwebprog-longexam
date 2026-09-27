const Log = require("../models/logModel");
const { HttpStatus } = require("../config/constants");
const { parsePagination, parseSort } = require("../utils/queryHelpers");

const LOG_LEVELS = ["info", "warn", "error"];

const getLogs = async (req, res) => {
  try {
    const { level, sort } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (level) {
      if (!LOG_LEVELS.includes(level)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid log level" });
      }
      filter.level = level;
    }

    const [logs, total] = await Promise.all([
      Log.find(filter)
        .sort(parseSort(sort))
        .skip(skip)
        .limit(limit),
      Log.countDocuments(filter),
    ]);

    res.status(HttpStatus.OK).json({
      logs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = { getLogs };
