import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  text: {
    type: String,
    unique: true,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
    default: [],
  },
  imageUrl: {
    type: String,
    required: false,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  viewsCount: {
    type: Number,
    required: false,
    default: 0
  }
}, {
  timestamps: true, // auto insert date of creation
});

export default mongoose.model('Post', PostSchema);