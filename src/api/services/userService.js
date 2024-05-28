const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userDetails) => {
    const { email, password } = userDetails;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = await userModel.create({
            email,
            password: hashedPassword
        });
        return newUser;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await userModel.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return {
            token: token,
            token_type: "Bearer",
            expires_in: 86400
        };
    } catch (error) {
        throw error;
    }
};

const getUserProfile = async (email, user, isAuthenticated) => {
    let profile;

    if (isAuthenticated && email === user.email) {
        profile = await userModel.findByEmail(email);
    } else {
        profile = await userModel.findByEmailPublic(email);
    }

    if (!profile) throw new Error('User not found');

    return profile;
};


const updateUserProfile = async (email, profileData, user) => {
    if (email !== user.email) {
        throw new Error('Forbidden');
    }

    const { password, email: newEmail, ...safeUpdateData } = profileData;

    try {
        const updatedUser = await userModel.updateByEmail(user.email, safeUpdateData);
        return updatedUser;
    } catch (error) {
        if (error.message === 'User not found') {
            return null;
        }
        throw new Error('Failed to update user profile: ' + error.message);
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
