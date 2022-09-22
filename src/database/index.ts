import mongoose from "mongoose";

import UserSchema, { modelName as UserModelName } from "./User.schema";
import DictionarySchema, { modelName as DictionaryModelName } from "./Dictionary.schema";
import HistorySchema, { modelName as HistoryModelName } from "./History.schema";

export const UserModel = mongoose.model(UserModelName, UserSchema);
export const DictionaryModel = mongoose.model(DictionaryModelName, DictionarySchema);
export const HistoryModel = mongoose.model(HistoryModelName, HistorySchema);
