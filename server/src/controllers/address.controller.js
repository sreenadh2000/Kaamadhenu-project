import { validationResult } from "express-validator";
import Address from "../models/address.model.js";

////////////////////////////////////////////////////////////
// USER - Get Logged In User Addresses
////////////////////////////////////////////////////////////
export const getAddresses = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only users can access their addresses",
        success: false,
      });
    }

    const addresses = await Address.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({ addresses: addresses, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

////////////////////////////////////////////////////////////
// ADMIN - Get Addresses By UserId
////////////////////////////////////////////////////////////
export const getAddressesByUserIdAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can access this resource",
        success: false,
      });
    }

    const addresses = await Address.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ data: addresses, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

////////////////////////////////////////////////////////////
// Get Address By Id (User Own OR Admin View)
////////////////////////////////////////////////////////////
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    // Admin can view any address
    if (req.user.role === "admin") {
      return res.status(200).json({ data: address, success: true });
    }

    // User can only view their own
    if (address.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view this address",
        success: false,
      });
    }

    res.status(200).json({ data: address, success: true });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "Invalid Address ID format", success: false });
    }

    res.status(500).json({ message: error.message, success: false });
  }
};

////////////////////////////////////////////////////////////
// USER - Create Address
////////////////////////////////////////////////////////////
export const createAddress = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Admin cannot create address",
        success: false,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }

    const {
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    // If setting default → remove previous default
    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.user.id,
      fullName,
      phone,
      email,
      addressLine1,
      // addressLine2,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    res.status(201).json({ address: address, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

////////////////////////////////////////////////////////////
// USER - Update Address
////////////////////////////////////////////////////////////
export const updateAddress = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Admin cannot update address",
        success: false,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }

    const address = await Address.findById(req.params.id);

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    if (address.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
        success: false,
      });
    }

    const { isDefault, ...otherFields } = req.body;

    // Handle default logic
    if (isDefault && !address.isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
      address.isDefault = true;
    }

    Object.assign(address, otherFields);

    const updatedAddress = await address.save();

    res.status(200).json({ data: updatedAddress, success: true });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "Invalid Address ID format", success: false });
    }

    res.status(500).json({ message: error.message, success: false });
  }
};

////////////////////////////////////////////////////////////
// USER - Delete Address
////////////////////////////////////////////////////////////
export const deleteAddress = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Admin cannot delete address",
        success: false,
      });
    }

    const address = await Address.findById(req.params.id);

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    if (address.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this address",
        success: false,
      });
    }

    await address.deleteOne();

    res.status(200).json({
      message: "Address deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

////////////////////////////////////////////////////////////
// USER - Set Default Address
////////////////////////////////////////////////////////////
export const setDefaultAddress = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Admin cannot modify address",
        success: false,
      });
    }

    const address = await Address.findById(req.params.id);
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    if (address.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
        success: false,
      });
    }

    await Address.updateMany({ userId: req.user.id }, { isDefault: false });

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      message: "Default address updated",
      address: address,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
