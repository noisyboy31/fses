import mongoose from "mongoose";

const validPositions = [
  {
    position: "Research Supervisor",
    allowedRoles: ["PM", "TS", "DR"],
  },
  "Program Coordinator",
  "Office Assistant",
];

const validatePositionAndRoles = (position, roles) => {
  if (position === "Research Supervisor") {
    const allowedRoles = ["PM", "TS", "DR"];
    return roles.every((role) => allowedRoles.includes(role));
  }
  return true;
};

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique Username"],
    unique: [true, "Username Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide a unique email"],
    unique: true,
  },
  position: {
    type: String,
    required: [true, "Please provide a position"],
    validate: {
      validator: function (value) {
        return validatePositionAndRoles(value, this.roles);
      },
      message: "Invalid position",
    },
  },
  roles: {
    type: [String],
  },
  lectureID: { type: String },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
