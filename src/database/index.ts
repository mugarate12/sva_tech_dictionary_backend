import mongoose from "mongoose";

import DictionarySchema, { modelName as DictionaryModelName } from "./Dictionary.schema";
import FavoriteSchema, { modelName as FavoriteModelName } from "./Favorite.schema";
import HistorySchema, { modelName as HistoryModelName } from "./History.schema";
import UserSchema, { modelName as UserModelName } from "./User.schema";

export const DictionaryModel = mongoose.model(DictionaryModelName, DictionarySchema);
export const FavoriteModel = mongoose.model(FavoriteModelName, FavoriteSchema);
export const HistoryModel = mongoose.model(HistoryModelName, HistorySchema);
export const UserModel = mongoose.model(UserModelName, UserSchema);
