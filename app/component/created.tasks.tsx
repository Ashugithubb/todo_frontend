'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook/hook';
import { getAllTaskThunk } from '../redux/slice/task.slice';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
    Card,
    CardContent,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function TaskList() {
    const dispatch = useAppDispatch();
    const router  = useRouter();
    const { tasks, loading, error, total, page, limit } = useAppSelector(
        (state) => state.task
    );

    useEffect(() => {
        dispatch(getAllTaskThunk({ page: 1, limit: 3 }));
    }, [dispatch]);

    const handelClick = (taskId:number)=>{
        router.push(`/home/${taskId}`);
    }

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>
                Task List
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            )}

           {error && <Alert  severity="error">{error}</Alert>}

            {!loading && tasks.length === 0 && (
                <Typography>No tasks found.</Typography>
            )}

            <Box display="grid" gap={2} >
                {tasks.map((task) => (
                    <Card key={task.id} >
                        <Box onClick={()=>handelClick(task.id)}>
                        <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            <Typography>{task.description}</Typography>
                            <Typography variant="body2">
                                Start: {new Date(task.startTime).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                                End: {new Date(task.endTime).toLocaleString()}
                            </Typography>
                        </CardContent>
                        </Box>
                    </Card>
                ))}
            </Box>

            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={Math.ceil(total / (limit || 1))}
                    page={page}
                    onChange={(_, value) => {
                        dispatch(getAllTaskThunk({ page: value, limit }));
                    }}
                />

            </Box>
        </Box>
    );
}
