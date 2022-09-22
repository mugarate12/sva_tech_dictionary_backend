import mongoose from "mongoose";

export const modelName = 'Favorite';
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
