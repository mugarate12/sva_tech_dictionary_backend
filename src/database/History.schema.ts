import mongoose from "mongoose";

export const modelName = 'History';
export default new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
