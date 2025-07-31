import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Task {
  id: number,
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

interface TaskState {
  tasks: Task[];
  total: number,
  page: number,
  limit: number
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  total: 0,
  page: 1,
  limit: 0,
  loading: false,
  error: null,
};
export interface GetTaskQuery {
  page?: number;
  limit?: number;
  title?: string;
  startTime?: string;
  endTime?: string;
}
export const getAllTaskThunk = createAsyncThunk(
  'task/getFilteredTasks',
  async (query: GetTaskQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/task/filter', {
        params: query,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);
const recipeSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearRecipes: (state) => {
      state.tasks = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllTaskThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            task: Task[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.loading = false;
          state.tasks = action.payload.task;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getAllTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
},
});

export const { clearRecipes } = recipeSlice.actions;

export default recipeSlice.reducer;