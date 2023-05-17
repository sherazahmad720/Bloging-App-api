import User from '../models/User';
import bcrypt from 'bcrypt';
export const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);

    }
    if (!users) {
        return res.status(404).json({ message: 'no users found' });
    }
    res.status(200).json({ users });
}
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });


    } catch (err) {
        return console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists!. Login Instead' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });
    try {
        await userData.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(201).json({ userData });
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });


    } catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        return res.status(404).json({ message: 'user did\'t exist against this Email' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid Credentials' });
    }
    return res.status(200).json({ message: 'Login Successfully' });
}
