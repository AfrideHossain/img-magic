import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// Types of user model
export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
// user model
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// define a pre hook (do something just before sent it to database)
userSchema.pre("save", async function (next) {
  if (this.isModified(this.password)) {
    //hash the password
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
