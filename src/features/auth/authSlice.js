import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            if (response.data) {
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, userData);
            if (response.data) {
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${API_URL}/auth/me`, config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;