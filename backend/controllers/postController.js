const Post = require('../models/postModel')
const multer = require('multer');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

// save image to disk
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/posts');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `post-${req.user.id}-${Date.now()}.${ext}`);
    }
})

// check if uploaded file is an image
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Not an image! Please upload only images.', 400), false);
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });


exports.uploadPostPhoto = (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err) {
            // handle the error
            return next(new AppError('Photo upload failed.', 400));
        }

        if (!req.file) {
            return next(new AppError('No photo uploaded.', 400));
        }

        // Store the filename in session or a temporary storage for later use.
        req.session.uploadedPhotoFilename = req.file.filename;
        
        res.status(200).json({
            status: 'success',
            filename: req.file.filename
        });
    });
};

exports.deletePostPhoto = (req, res, next) => {
    const filename = req.session.uploadedPhotoFilename;

    if (!filename) {
        return next(new AppError('No photo has been uploaded. Please upload a photo first.', 400));
    }

    // Delete the file from disk
    fs.unlink(`public/img/posts/${filename}`, (err) => {
        if (err) {
            return next(new AppError('Photo deletion failed.', 400));
        }

        // Clear the filename from session and temporary storage
        delete req.session.uploadedPhotoFilename;


        res.status(200).json({
            status: 'success',
            filename: filename
        });
    });
}

// postController.js

exports.createPost = catchAsync(async (req, res, next) => {
    if (!req.session.uploadedPhotoFilename) {
        return next(new AppError('No photo has been uploaded. Please upload a photo first.', 400));
    }
    

    const filteredBody = {
        caption: req.body.caption, 
        user: req.body.userId ? req.body.userId : req.user.id,
        photo: req.session.uploadedPhotoFilename
    };

    // Create the post and reference it to the user
    const newPost = await Post.create(filteredBody);

    // Add the post to the user's posts array
    await User.findByIdAndUpdate(filteredBody.user, {$push: {posts: newPost._id}});

    // Clear the filename from session or temporary storage
    delete req.session.uploadedPhotoFilename;

    res.status(201).json({
        status: 'success',
        post: newPost,
    });
});

exports.toggleLikeStatus = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) return next(new AppError('No post found with that id', 404));

    if (post.likes.includes(req.user.id)) {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {$pull: {likes: req.user.id}}, {new: true});
    
        // Emit an event for unlike
        const io = req.app.get('io');
        io.emit('postUnliked', {postId: req.params.postId, userId: req.user.id});
        console.log("Emitted postUnliked event:", { postId: req.params.postId, userId: req.user.id });


        return res.status(200).json({
            status: "success",
            data: updatedPost
        });
    } else {
        const io = req.app.get('io');
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {$push: {likes: req.user.id}}, {new: true}).populate({path: 'likes', select: 'username photo'});

        // Emit an event for like
        io.emit('postLiked', {postId: req.params.postId, userId: req.user.id});
        console.log("Emitted postLiked event:", { postId: req.params.postId, userId: req.user.id });

        res.status(200).json({
            status: "success",
            data: updatedPost
        });
    }
});
