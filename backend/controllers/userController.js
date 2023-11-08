const catchAsync = require("../utils/catchAsync");
const multer = require('multer');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const AppError = require("../utils/appError");
const { filterObj } = require("../utils/filterObj");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Not an image! Please upload only images.', 400), false);
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    // send response
    res.status(200).json({
        status: "success",
        results: users.length,
        users: users
    }); 
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({username: req.params.username});

    if(!user) return next(new AppError('No user found with that username', 404));
    // send response
    res.status(200).json({
        status: "success",
        user: user
    });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    
    if(!user) return next(new AppError('You are not logged in!', 403));

    res.status(200).json({
        status: "success",
        user: user
    })
});

exports.updateMe = catchAsync(async (req,res,next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    // 2) Filter out unwanted fields that are not allowed to be updated
    // const filteredBody = filterObj(req.body, 'bio', 'gender', 'website');

    if (req.file) filteredBody.photo = req.file.filename;
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {new: true, runValidators: true});
    // 4) Send response
    res.status(200).json({
        status: 'success',
        user: updatedUser
    });
})


exports.getFeed = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const following = user.following;
    following.push(req.user.id);

    const limit = Number(req.query.limit) || 5;
    const offset = Number(req.query.offset) || 0;

    const posts = await Post.find({ user: { $in: following } })
        .populate({path: 'comments', select: 'text createdAt user', options: {sort: {createdAt: -1}}})
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);
        

    const postCount = await Post.countDocuments({ user: { $in: following } });

    const nextPage = offset + limit < postCount ? (offset + limit) : null;

    const postsWithIsLiked = posts.map(post => ({
        ...post.toObject(),
        isLiked: post.likes.includes(req.user.id),
    }));

    res.status(200).json({
        status: "success",
        results: postsWithIsLiked.length,
        total: postCount,
        posts: postsWithIsLiked,
        nextPage
    });
});



exports.followUser = catchAsync(async (req, res, next) => {
    // get user to follow
    const followedUser = await User.findOne({username: req.params.username});

    // check if user exists
    if (!followedUser) return next(new AppError('No user found with that username', 404));

    // check if user is already following
    if (followedUser.followers.includes(req.user.id)) return next(new AppError('You are already following this user', 400));

    // add followed user to current user following array
    await User.findByIdAndUpdate(req.user.id, { $push: { following: followedUser._id } });

    // add current user to followed user followers array
    await User.findByIdAndUpdate(followedUser._id, { $push: { followers: req.user.id } });

    // send response
    res.status(200).json({
        status: "success",
        data: followedUser
    });
});

exports.unfollow = catchAsync(async(req, res, next) => {
    const unfollowedUser = await User.findOne({username: req.params.username});

    console.log(unfollowedUser);

    if (!unfollowedUser) {
        return next(new AppError("No user found with that username", 404));
    }

    if (!unfollowedUser.followers.includes(req.user.id)) return next(new AppError("You are already not following this user", 400))

    const user = await User.findByIdAndUpdate(req.user.id, { $pull: { following: unfollowedUser._id } }, {new: true})

    await User.findByIdAndUpdate(unfollowedUser._id, { $pull: { followers: req.user.id } });

    res.status(200).json({
        status: "success",
        data: user
    });

});