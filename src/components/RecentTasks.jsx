import React, { useState, useEffect } from 'react';

export default function RecentTasks() {
    const [taskData, setTaskData] = useState([]);

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
    }, []);

    // Slice the taskData array to include only the last 7 tasks
    const last7Tasks = taskData.slice(-7);

    return (
        <div className='container' >
            <h1>Recent Tasks</h1>
            <table className="table custom-table " style={{ maxWidth: "50rem", borderRadius: "22px" }}>
                <thead className="thead">
                    <tr>
                        <th className='col-6' scope="col" style={{ backgroundColor: "#D3D3D3" }}>Project Title</th>
                        <th className='col-2' scope="col" style={{ backgroundColor: "#D3D3D3", textAlign: "center" }}>Priority</th>
                        <th className='col-4' scope="col" style={{ backgroundColor: "#D3D3D3", textAlign: "center" }}>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {last7Tasks.map(task => (
                        <tr key={task._id}>
                            <td style={{ backgroundColor: "#D3D3D3" }}>{task.task}</td>
                            <td style={{ backgroundColor: "#D3D3D3", textAlign: "center" }}>{task.priority==="low"?"Low":task.priority==="medium"?"Medium":"High"}</td>
                            <td style={{ backgroundColor: "#D3D3D3", textAlign: "center" }}>{task.endDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
