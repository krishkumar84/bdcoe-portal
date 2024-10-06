import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  studentNo: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    required: true,
    },
//  projects: [
//         {
//           title: { type: String, required: true },
//           link: { type: String, required: true }, // URL link for individual project submission
//           submissionDate: { type: Date, default: Date.now }
//         }
//       ]
    
  },{ timestamps: true });

  export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
