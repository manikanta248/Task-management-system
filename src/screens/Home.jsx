import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RecentTasks from '../components/RecentTasks';
import img1 from './clipboard.png';
import completed from './completed.png';
import InProgress from "./work-in-progress.png";
import ToDo from "./to-do.png";

export default function Home() {
    const [taskData, setTaskData] = useState([]);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [inProgressTasks, setInProgressTasks] = useState(0);
    const [todoTasks, setTodoTasks] = useState(0);

    const token = localStorage.getItem("token");

    const loadTaskData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/gettask", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            });
            const data = await response.json();
            setTaskData(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadTaskData();
    }, []); // Ensure useEffect runs only once after initial render

    useEffect(() => {
        // Calculate counts for each status
        const completedCount = taskData.filter(task => task.status === 'Completed').length;
        const inProgressCount = taskData.filter(task => task.status === 'In Progress').length;
        const todoCount = taskData.filter(task => task.status === 'To Do').length;

        // Set the state for each count
        setCompletedTasks(completedCount);
        setInProgressTasks(inProgressCount);
        setTodoTasks(todoCount);
    }, [taskData]); // Update counts whenever taskData changes

    return (
        <div className='text-white'>
            <Navbar />
            <div className='d-flex container mt-4'>
                <div className='home-task-details flex-grow-1'>
                    <div className="card" style={{ width: "23rem", backgroundColor: " #f3e8a9", boxShadow: "6px 6px 0 0  rgba(0, 0, 0, 0.2)" }}>
                        <div className="card-body">
                            <h3 className="card-title">Total Tasks</h3>
                            <div className='row'>
                                <p className="card-text col-9 fs-3">{taskData.length}</p>
                                <img className='col-3' src={img1} style={{ width: "80px" }} alt="Clipboard Icon" />
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ width: "23rem", backgroundColor: " #f3e8a9", boxShadow: "6px 6px 0 0  rgba(0, 0, 0, 0.2)" }}>
                        <div className="card-body">
                            <h3 className="card-title">Completed</h3>
                            <div className='row'>
                                <p className="card-text col-9 fs-3">{completedTasks}</p>
                                <img className='col-3' src={completed} style={{ width: "80px" }} alt="Completed Icon" />
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ width: "23rem", backgroundColor: " #f3e8a9", boxShadow: "6px 6px 0 0  rgba(0, 0, 0, 0.2)" }}>
                        <div className="card-body">
                            <h3 className="card-title">In Progress</h3>
                            <div className='row'>
                                <p className="card-text col-9 fs-3">{inProgressTasks}</p>
                                <img className='col-3' src={InProgress} style={{ width: "80px" }} alt="In Progress Icon" />
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ width: "23rem", backgroundColor: " #f3e8a9", boxShadow: "6px 6px 0 0  rgba(0, 0, 0, 0.2)" }}>
                        <div className="card-body">
                            <h3 className="card-title">To Do</h3>
                            <div className='row'>
                                <p className="card-text col-9 fs-3">{todoTasks}</p>
                                <img className='col-3' src={ToDo} style={{ width: "80px" }} alt="To Do Icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='recent-task-list container mt-5 '>
                
                <RecentTasks />
            </div>
        </div>
    )
}
