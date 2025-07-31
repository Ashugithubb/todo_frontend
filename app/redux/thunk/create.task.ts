import { taskSchema } from '@/app/schema/create.task.schema';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import z from 'zod';

type TaskFormData = z.infer<typeof taskSchema>;

export const createTask = createAsyncThunk(
  'task/create',
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/task/create',
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
