import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task } from '../interfaces/TaskInterface';

interface TaskListInterface {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskListInterface = {
  tasks: [],
  loading: false,
  error: null,
};

// COMMENT: Que el endpoint quede en una constante e igual agregar error handling.

// Async Thunks for fetching and modifying tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get('http://localhost:8080/api/tasks');
  return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: Task) => {
  const response = await axios.post('http://localhost:8080/api/tasks', task);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, task }: { id: number; task: Task }) => {
  const response = await axios.put(`http://localhost:8080/api/tasks/${id}`, task);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number) => {
  await axios.delete(`http://localhost:8080/api/tasks/${id}`);
  return id;
});

export const toggleTaskStatus = createAsyncThunk('tasks/toggleTaskStatus', async (id: number) => {
  const response = await axios.put(`http://localhost:8080/api/tasks/toggle/${id}`);
  return response.data;
});

// Slice, encapsulating all the actions
// COMMENT: Aquí hay mucho código que se repite, sería cuestión de ver como puede hacerse una especie de función general con callback y que los cases fueran más sencillos
const TaskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }: PayloadAction<Task[]>) => {
        state.tasks = payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, { error }) => {
        state.loading = false;
        state.error = ((error.name || '') + error.message + error.code) || 'Failed to fetch tasks';
      })
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, { payload }: PayloadAction<Task>) => {
        state.tasks.push(payload);
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to create task';
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, { payload }: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task: Task) => task.id === payload.id);
        if (index !== -1) {
          state.tasks[index] = payload;
        }
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to update task';
      })
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((task: Task) => task.id !== payload);
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to delete task';
      })
      
      // Toggle task status
      .addCase(toggleTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, { payload }: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task: Task) => task.id === payload.id);
        if (index !== -1) {
          state.tasks[index] = payload;
        }
        state.loading = false;
      })
      .addCase(toggleTaskStatus.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to toggle task status';
      });
  },
});

export default TaskSlice.reducer;

