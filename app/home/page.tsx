import TaskForm from "../component/create.task";
import TaskList from "../component/created.tasks";
import Navbar from "../component/navbar";

export default function DashBoard() {
    return(
        <>
        <Navbar/>
         This Home Page
        <TaskList/>
        <TaskForm/>
        </>
    )
}