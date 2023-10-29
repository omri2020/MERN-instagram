const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'A comment must have a body']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A comment must belong to a user']
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'A comment must belong to a post']
    }
    }, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'username photo'
    });
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;