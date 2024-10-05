import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
    },
 projects: [
        {
          title: { type: String, required: true },
          link: { type: String, required: true }, // URL link for individual project submission
          submissionDate: { type: Date, default: Date.now }
        }
      ]
    
  },{ timestamps: true });

const User = models?.User || model("User", UserSchema);

export default User;