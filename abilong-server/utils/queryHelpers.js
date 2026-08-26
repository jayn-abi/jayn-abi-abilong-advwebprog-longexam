const mongoose = require("mongoose");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const resolveRefId = async (Model, value) => {
  if (!value) return undefined;
  if (isObjectId(value)) return value;
  const doc = await Model.findOne({ name: new RegExp(`^${escapeRegex(value)}$`, "i") }).select("_id");
  return doc ? doc._id : null;
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const parseSort = (sortParam) => {
  if (!sortParam) return { createdAt: -1 };
  return sortParam.split(",").reduce((acc, field) => {
    const trimmed = field.trim();
    if (!trimmed) return acc;
    if (trimmed.startsWith("-")) acc[trimmed.slice(1)] = -1;
    else acc[trimmed] = 1;
    return acc;
  }, {});
};

module.exports = { escapeRegex, isObjectId, resolveRefId, parsePagination, parseSort };
