import authService from "../services/authService.js";
import asyncHandler from "express-async-handler";
import { isValidEmail, isStrongPassword, sanitizeInput } from "../utils/validators.js";



  /**
   * @route   POST /api/auth/register
   * @desc    Register a new user
   * @access  Public
   */

const registerUserController = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        if(!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
            
        }

        const user = await authService.register({ username, email ,password});
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});


  /**
   * @route   POST /api/auth/login
   * @desc    Login user
   * @access  Public
   */

const loginUserController = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            })
        }

        const user = await authService.login({ email, password });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

const getUserByIdController = asyncHandler(async (req, res) => {
    try {
            const user = await authService.getUserById(req.params.id);

            res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
})

const getUserProfileController = asyncHandler(async (req, res) => {
    try{
        const user = await authService.getUserById(req.user.id);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
})

export { 
    registerUserController,
    loginUserController,
    getUserByIdController,
    getUserProfileController,
}
