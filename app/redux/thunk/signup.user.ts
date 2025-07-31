import { signupSchema } from '@/app/(auth)/signup/schema/user.schema';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import z from 'zod';

type SignupFormData = z.infer<typeof signupSchema>;

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: SignupFormData, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/user/signup',
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
