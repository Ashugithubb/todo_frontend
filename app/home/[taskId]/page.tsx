'use client'
import { useAppSelector } from "@/app/redux/hook/hook";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function TaskDetails(){
    const params = useParams();
    return(
        <>
        <Typography>Task Name</Typography>
        <Typography>{`Task Id${params.taskId}`}</Typography>
        <Box sx={{display:"flex", gap:3}}>
        <Button variant="contained">Delete Task</Button>
        <Button variant="contained">Edit Task</Button>
        <Button variant="contained">Add Assigne</Button></Box>
        </>
    )
}