import mongoose from 'mongoose';
import Blog from '../models/Blog';
import User from '../models/User';


export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: 'no blogs found' });
    }
    res.status(200).json({ blogs });


};
export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    let existingUser;

    try {
        existingUser = await User.findById(user);
    } catch (error) {
        console.log(error);
    }
    if (!existingUser) {
        return res.status(404).json({ message: 'user not found' });
    }

    const blogData = new Blog({
        title,
        description,
        image,
        user
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blogData.save({ session });
        existingUser.blogs.push(blogData);
        await existingUser.save({ session });
        await session.commitTransaction();
        session.endSession();
    } catch (err) {

        return res.status(500).json({ message: err });
    }
    return res.status(200).json({ blogData });
}
export const updateBlog = async (req, res, next) => {

    const { title, description } = req.body;
    const blogId = req.params.id;
    console.log(blogId);
    let blog;
    try {

        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        });
    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        console.log(blog);
        return res.status(404).json({ message: 'unable to update the blog' });
    }
    return res.status(200).json({ blog });
}
export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;

    try {
        blog = await Blog.findById(id);
    } catch (error) {
        console.log(error);
    }
    if (!blog) {
        return res.status(404).json({ message: 'no blog found against this id' });
    }
    return res.status(200).json({ blog });
};

export const deleteBlogById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        console.log(error);
    }
    if (!blog) {
        return res.status(500).json({ message: 'unable to delete the blog' });
    }
    return res.status(200).json({ 'message': 'Successfully Delete' });
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');

    } catch (error) {
        console.log(error);
    }
    if (!userBlogs) {
        return res.status(404).json({ message: 'no blogs found against this user' });
    }
    return res.status(200).json({ blogs: userBlogs });

}