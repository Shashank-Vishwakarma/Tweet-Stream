import User from '../models/userModel.js'
import { generateJwt } from '../utils/generateJwt.js'
import { ENV_VARIABLES } from '../config/envVariables.js';
import { validateEmail } from '../utils/validateEmail.js';

export const signUpAuth = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const isEmailFormatValid = validateEmail(email);
        if (!isEmailFormatValid) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must have at least 6 characters' });
        }

        const existingUserwithUsername = await User.findOne({ username });
        if (existingUserwithUsername) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const newUser = new User({ fullName, username, email, password });
        await newUser.save();

        // Now, create JWT
        const JWTToken = generateJwt({ id: newUser._id });
        const cookieOptions = {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: ENV_VARIABLES.NODE_ENV !== 'development'
        };
        res.cookie('token', JWTToken, cookieOptions);
        res.status(201).json({
            message: 'User SignUp successful!',
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.log(`Error in signUpAuth: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginAuth = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must have at least 6 characters' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'User does not exist' });
        }

        // verify the password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // generate Token
        const JWTtoken = generateJwt({ id: user._id });
        const cookieOptions = {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: ENV_VARIABLES.NODE_ENV !== 'development'
        };
        res.cookie('token', JWTtoken, cookieOptions);
        res.status(200).json({
            message: 'Login successful!',
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.log(`Error in loginAuth: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logoutAuth = (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({ message: 'User logged out successfully!' });
    } catch (error) {
        console.log(`Error in logoutAuth: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};
