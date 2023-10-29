const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    select: false,
  },
  passwordChangedAt: Date,
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bio: String,
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female'],
      message: 'Please insert a valid gender.'
    }
  },
  posts: [
    { type: mongoose.Schema.ObjectId, ref: "Post" }
  ],
  followers: [
    { type: mongoose.Schema.ObjectId, ref: "User" }
  ],
  following: [
    { type: mongoose.Schema.ObjectId, ref: "User" }
  ],
});

userSchema.pre(/^findOne/, function (next) {
  this.populate('posts').select('-__v');
  next();
});

userSchema.pre("save", async function (next) {
  // Check if password is modified. If not, move to the next middleware.
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.method("correctPassword", async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
});

userSchema.method("changedPasswordAfter", function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
