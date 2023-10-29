const mongoose = require("mongoose");
const User = require('./userModel');

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "A post must have a body"],
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A post must belong to a user"],
  },
  location: String,
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// postSchema.pre('/^find/', function(next) {
//   this.populate({path: 'likes', select: 'username photo'});

//   next();
// })

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
