'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Pagination,
    Card,
    CardContent,
    TextField,
    Button,
    Autocomplete,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hook/hook';
import { getAllTaskThunk } from '../redux/slice/task.slice';
import { useRouter } from 'next/navigation';
import { useUserSearch } from './search.user';

interface UserOption {
    id: number;
    name: string;
}

export default function TaskList() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { tasks, loading, total, page, limit } = useAppSelector(
        (state) => state.task
    );

   
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [creatorUser, setCreatorUser] = useState<UserOption | null>(null);
    const [assignees, setAssignees] = useState<UserOption[]>([]);

    const [creatorQuery, setCreatorQuery] = useState('');
    const [assigneeQuery, setAssigneeQuery] = useState('');

    const { results: creatorResults } = useUserSearch(creatorQuery);
    const { results: assigneeResults } = useUserSearch(assigneeQuery);

    useEffect(() => {
        dispatch(getAllTaskThunk({ page: 1, limit: 3 }));
    }, [dispatch]);

    const handleClick = (taskId: number) => {
        router.push(`/home/${taskId}`);
    };

    const handleFilter = () => {
        dispatch(
            getAllTaskThunk({
                page: 1,
                limit: 3,
                title,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                creatorId: creatorUser?.id,
                assigneeIds: assignees.length > 0 ? assignees.map((u) => u.id) : undefined,
            })
        );
    };

    const handlePageChange = (_: unknown, value: number) => {
        dispatch(
            getAllTaskThunk({
                page: value,
                limit,
                title,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                creatorId: creatorUser?.id,
                assigneeIds: assignees.length > 0 ? assignees.map((u) => u.id) : undefined,
            })
        );
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>Task List</Typography>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    label="Search by Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Start Time"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <TextField
                    label="End Time"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />

                <Autocomplete
                    options={creatorResults}
                    getOptionLabel={(option) => option.name}
                    onInputChange={(_, value) => setCreatorQuery(value)}
                    onChange={(_, value) => setCreatorUser(value)}
                    value={creatorUser}
                    renderInput={(params) => (
                        <TextField {...params} label="Search Creator" />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />

                <Autocomplete
                    multiple
                    options={assigneeResults}
                    getOptionLabel={(option) => option.name}
                    onInputChange={(_, value) => setAssigneeQuery(value)}
                    onChange={(_, value) => setAssignees(value)}
                    value={assignees}
                    renderInput={(params) => (
                        <TextField {...params} label="Search Assignees" />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />

                <Button variant="contained" onClick={handleFilter}>
                    Apply Filter
                </Button>
            </Box>

            {/* Loading */}
            {loading && (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            )}

            {/* No tasks */}
            {!loading && tasks.length === 0 && (
                <Typography>No tasks found.</Typography>
            )}

            {/* Task cards */}
            <Box display="grid" gap={2}>
                {tasks.map((task) => (
                    <Card key={task.id}>
                        <Box onClick={() => handleClick(task.id)} sx={{ cursor: 'pointer' }}>
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

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={Math.ceil(total / (limit || 1))}
                    page={page}
                    onChange={handlePageChange}
                />
            </Box>
        </Box>
    );
}
