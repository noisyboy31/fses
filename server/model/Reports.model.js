import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [20, "Name cannot be more than 20 characters"],
  },
  file: {
    type: String,
    required: [true, "Please provide a file"],
  },
  status: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model.Reports || mongoose.model("Report", itemSchema);
