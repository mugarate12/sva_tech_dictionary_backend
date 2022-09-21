import mongoose from "mongoose";

import UserSchema, { modelName as UserModelName } from "./User.schema";
import DictionarySchema, { modelName as DictionaryModelName } from "./Dictionary.schema";

export const UserModel = mongoose.model(UserModelName, UserSchema);
export const DictionaryModel = mongoose.model(DictionaryModelName, DictionarySchema);
