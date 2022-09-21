import mongoose from "mongoose";

import UserSchema, { modelName as UserModelName } from "./User.schema";

export const UserModel = mongoose.model(UserModelName, UserSchema);
