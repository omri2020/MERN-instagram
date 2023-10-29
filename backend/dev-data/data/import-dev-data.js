const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../models/userModel');
const Post = require('../../models/postModel');

dotenv.config({ path: 'config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.MONGODB_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));


// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Post.create(posts);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// Run this command in the terminal to import data:
// node dev-data/data/import-dev-data.js --import
// Run this command in the terminal to delete data:
// node dev-data/data/import-dev-data.js --delete
