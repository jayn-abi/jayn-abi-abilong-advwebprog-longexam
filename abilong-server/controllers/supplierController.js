const Supplier = require("../models/supplierModel");
const { HttpStatus } = require("../config/constants");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.status(HttpStatus.OK).json({ suppliers });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const getMySupplier = async (req, res) => {
  try {
    if (!req.user.supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "No supplier profile linked to this account" });
    const supplier = await Supplier.findById(req.user.supplier);
    if (!supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "Supplier not found" });
    res.status(HttpStatus.OK).json(supplier);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const updateMySupplier = async (req, res) => {
  try {
    if (!req.user.supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "No supplier profile linked to this account" });
    const { name, contactEmail, phone, address } = req.body;
    const supplier = await Supplier.findByIdAndUpdate(
      req.user.supplier,
      { name, contactEmail, phone, address },
      { new: true, runValidators: true }
    );
    if (!supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "Supplier not found" });
    res.status(HttpStatus.OK).json(supplier);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "Supplier not found" });
    res.status(HttpStatus.OK).json(supplier);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(HttpStatus.CREATED).json(supplier);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "Supplier not found" });
    res.status(HttpStatus.OK).json(supplier);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(HttpStatus.NOT_FOUND).json({ message: "Supplier not found" });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  getMySupplier,
  updateMySupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
