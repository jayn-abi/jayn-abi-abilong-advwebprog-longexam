const User = require("../models/userModel");
const Supplier = require("../models/supplierModel");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");
const { HttpStatus } = require("../config/constants");

const USER_TYPES = ["customer", "supplier", "admin"];

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.status(HttpStatus.OK).json({ users });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const updateMe = async (req, res) => {
  try {
    const { firstName, lastName, username, contactNumber, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUsername) {
        return res.status(HttpStatus.CONFLICT).json({ message: "Username already in use" });
      }
      user.username = username;
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;

    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(HttpStatus.OK).json({ message: "Profile updated successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};


const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(HttpStatus.BAD_REQUEST).json({ message: "Current password is incorrect" });

    user.password = newPassword; 
    await user.save();

    res.status(HttpStatus.OK).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const createUser = async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Password is required" });
    }

    const user = new User(req.body); 
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(HttpStatus.CREATED).json(userWithoutPassword);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });

   
    if (req.body.password) {
      user.password = req.body.password;
    }

   
    Object.assign(user, req.body);

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type, supplier: user.supplier },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(HttpStatus.OK).json({ message: "User updated successfully", user: userWithoutPassword, token });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(HttpStatus.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });

    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is inactive. Please contact support." });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type, supplier: user.supplier },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const { password: pw, ...userWithoutPassword } = user.toObject();
    res.status(HttpStatus.OK).json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, contactNumber, address, type, businessName } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !contactNumber || !address) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Please fill in all required fields" });
    }

    if (type && !USER_TYPES.includes(type)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid account type" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(HttpStatus.CONFLICT).json({ message: "Email already in use" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(HttpStatus.CONFLICT).json({ message: "Username already in use" });

    const user = new User({ firstName, lastName, email, username, password, contactNumber, address, type });

    if (type === "supplier") {
      try {
        const supplier = await Supplier.create({
          name: businessName?.trim() || `${firstName} ${lastName}`,
          contactEmail: email,
          phone: contactNumber,
          address,
        });
        user.supplier = supplier._id;
      } catch (supplierError) {
        if (supplierError.code === 11000) {
          return res.status(HttpStatus.CONFLICT).json({ message: "That business name is already in use. Please choose another." });
        }
        throw supplierError;
      }
    }

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type, supplier: user.supplier },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const { password: pw, ...userWithoutPassword } = user.toObject();
    res.status(HttpStatus.CREATED).json({ message: "Signup successful", user: userWithoutPassword, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(HttpStatus.CONFLICT).json({ message: "That account already exists." });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  getMe,
  updateMe,
  changeMyPassword,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  signupUser,
};
