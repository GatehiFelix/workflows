import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.js';

class AuthService {
    /**
     * Registers a new user.
     */
    async register({username, email, password}) {
        const existingUser  = await User.findOne({where: { email }});
        if(existingUser) {
            throw new Error('User already exists');
        }



        const user  = await User.create({
            username,
            email,
            password: password,
        });

        const token = this.generateToken(user);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            token,
        }
    }

    /**
     * Logs in an existing user.
     */
    async login({email, password}) {
        const user = await User.findOne({ where: { email }});
        if(!user) {
            console.log('User not found with email:', email);
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken(user);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            token,
        };
    }

    /**
     * get user by id
     */
    async getUserById(userId) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] }
        });

        if(!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Generates a JWT token for a user.
     */
    generateToken(user) {
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })
    }

    /**
     * verfiy token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

export default new AuthService();