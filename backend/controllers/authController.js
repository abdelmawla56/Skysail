const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper to send email
const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${code}. It will expire in 10 minutes.`,
        html: `<h3>Email Verification</h3><p>Your verification code is: <strong>${code}</strong></p><p>It will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            verificationCode,
            verificationCodeExpires,
        });

        if (user) {
            // Send email
            await sendVerificationEmail(email, verificationCode);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                token: generateToken(user._id),
                message: 'Registration successful. Please check your email for the verification code.',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify email with 6-digit code
// @route   POST /api/auth/verify
// @access  Public
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.json({
            message: 'Email verified successfully',
            isVerified: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
