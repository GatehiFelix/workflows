import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
    'userLogin/login',
    async ({email, password}, {rejectedWithValue}) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' }
            }

            const { data } = await axios.post(
                '/api/users/login',
                { email, password },
                config
            )

            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectedWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    'userLogin/logout',
    async () => {
        localStorage.removeItem('userInfo');
    }
)