import { loginSchema } from '@/app/(auth)/login/page';
import { signupSchema } from '@/app/(auth)/signup/schema/user.schema';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import z from 'zod';

type loginFormData = z.infer<typeof loginSchema>;

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data:  loginFormData, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/auth/login',
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
