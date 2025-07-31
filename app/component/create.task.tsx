'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import { useAppDispatch } from '@/app/redux/hook/hook';

import { taskSchema } from '../schema/create.task.schema';
import { createTask } from '../redux/thunk/create.task';

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: '',
            endTime: '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            console.log("inside on submit");
           const res =  await dispatch(createTask(data));
            toast(res.payload);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { message } = error.response.data;
                toast.error(message);
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        }
    };

    return (
        <>
            <ToastContainer />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <Paper elevation={3} sx={{ padding: 4, width: 450 }}>
                    <Typography variant="h5" gutterBottom>
                        Create Task
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            label="Title"
                            {...register('title')}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Description"
                            {...register('description')}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        <TextField
                            label="Start Time"
                            type="datetime-local"
                            {...register('startTime')}
                            error={!!errors.startTime}
                            helperText={errors.startTime?.message}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="End Time"
                            type="datetime-local"
                            {...register('endTime')}
                            error={!!errors.endTime}
                            helperText={errors.endTime?.message}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Add Task
                        </Button>
                    </form>
                </Paper>
            </Box>
        </>
    );
}
