import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: String,
}, {
  timestamps: true, // auto insert date of creation
});

export default mongoose.model('User', UserSchema);