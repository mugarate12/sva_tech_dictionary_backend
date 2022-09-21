import mongoose from "mongoose";

export const modelName = 'Dictionary';
export default new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true
  },
});
