import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditTask from '../components/EditTask';
import AddSubTaskModal from '../components/AddSubTask';

export default function Completed() {
    const [ShowSubTask, setShowSubTask] = useState(false);
    const [askDelete, setaskDelete] = useState(false);
    const [createTask, setcreateTask] = useState(false);
    const [addSubTask, setAddSubTask] = useState(false);
    const [viewTask, setViewTask] = useState(false);
    const [data, setData] = useState({ task: "", enddate: "", priority: "", status: "To Do" });
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState({ task: "", enddate: "", priority: "", status: "", _id: "" });
    const [id, setid] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");
    const [TaskData, setTaskData] = useState([]);
    const [subtaskdata, setSubtaskData] = useState([]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/deletetask/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // Include an empty request body
            });

            if (response.ok) {
                // Task deleted successfully, update UI or perform any other action
                console.log('Task deleted successfully');
            } else {
                // Handle other response statuses (e.g., 404 Not Found)
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle fetch errors
        }
    };

    const loadTaskData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/gettask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            });
            const data = await response.json();
            // Format the dates before setting the state
            const formattedData = data.map(task => {
                // Ensure the task has an endDate property and it's not already a Date object
                if (task.endDate && !(task.endDate instanceof Date)) {
                    task.endDate = new Date(task.endDate).toLocaleDateString();
                }
                if (task.createdDate && !(task.createdDate instanceof Date)) {
                    task.createdDate = new Date(task.createdDate).toLocaleDateString();
                }
                return task; // Return unchanged if endDate is missing or already a Date object
            });
            setTaskData(formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const loadSubTaskData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/getsubtask`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // You may need to pass additional headers or data depending on your API
            });
            const data = await response.json();
            // Process the subtask data if needed
            setSubtaskData(data.subtask);
        } catch (error) {
            console.error('Error fetching subtasks:', error);
            // Handle fetch errors
        }
    };

    useEffect(() => {
        loadTaskData();
    }, []);
    useEffect(() => {
        loadSubTaskData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = formatDate(data.enddate);
        const newData = { ...data, enddate: formattedDate }
        console.log(data)
        try {
            const response = await fetch("http://localhost:5000/api/puttask", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data) // Send form data in the request body
            });
            const json = await response.json();
            if (!json.success) {
                setError(json.error);
            } else {
                // Clear form data on successful submission
                setData({ task: "", enddate: "", priority: "" });
                setcreateTask(false); // Close the modal
            }
        } catch (error) {
            console.error(error);
            setError("Internal server error");
        }
    };

    const formatDate = (dateString) => {
        // Split the date string by '/' and reorder it to 'yyyy-MM-dd'
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const fetchSubtasks = (subtasks) => {
        // Implement logic to fetch subtasks
        return subtasks;
    };

    const toggleModal = () => {
        setEdit(!edit);
    };

    const toggleDeleteModal = () => {
        setaskDelete(!askDelete);
    };

    const toggleCreateTaskModal = () => {
        setcreateTask(!createTask);
    };

    const toggleAddSubTaskModal = () => {
        setAddSubTask(!addSubTask);
    };

    const toggleViewTask = () => {
        setViewTask(!viewTask);
    };

    // Filter tasks based on the search query
    const filteredTasks = TaskData.filter(task => task.task.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className=''>
            <Navbar />
            <div className='container'>
                
                <div className='container' style={{}}>
                     
                        <div>
                            <h2 className='mt-4 p-3' style={{ maxWidth: "100%", borderRadius: "22px" }}>In Progress Tasks</h2>
                            {TaskData.map((task, index) => (
                                task.status === 'In Progress' && (
                                    <div key={index} className='container mt-4 p-3' style={{ backgroundColor: "#f3e8a9", borderRadius: "22px", maxWidth: "80rem" }}>

                                        <div className='mx-3' style={{ maxWidth: '100%' }}>
                                            <div>
                                                <label><h3>Task</h3></label>
                                                <p style={{ wordWrap: "break-word", fontWeight: "", fontSize: "25px" }}>{task.task}</p>
                                            </div>
                                        </div>
                                        <div className='d-flex mx-3'>
                                            <h4>Priority: </h4>
                                            <p className={`badge mt-2 mx-2 text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : 'danger'}`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>
                                        </div>
                                        <div className='mx-3 d-flex'>
                                            <h4>Created date: </h4>
                                            <p className='mx-2  fs-5'>{task.createdDate}</p>
                                        </div>
                                        <div className='mx-3 d-flex'>
                                            <h4>Submit Date:</h4>
                                            <p className='mx-2 fs-5'> {task.endDate}</p>
                                        </div>
                                        <div className='mx-3'>
                                            <h4>Total SubTasks: {task.subtasks.length}</h4>
                                            
                                                        <div className='mx-3'>
                                                            {ShowSubTask && (
                                                                <div style={{ backgroundColor: "#D3D3D3", padding: "20px", borderRadius: "22px" }}>
                                                                    {subtaskdata
                                                                        .filter(subtask => subtask.parentId === task._id) // Filter subtasks based on parentId
                                                                        .map((subtask, index) => (
                                                                            <div key={index} className='mx-2'>
                                                                                <div>
                                                                                    <label><h4>Sub Task {index + 1}</h4></label>
                                                                                    <p>{subtask.title}</p>
                                                                                </div>
                                                                                <div className='d-flex'>
                                                                                    <h4>End Date:</h4>
                                                                                    <p className='mx-2 mt-1'>{subtask.endDate}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            )}

                                                        </div>
                                                  
                                            <div className="d-flex justify-content-end mt-4" style={{}}>
                                                <div className="">
                                                    <button className="btn btn-primary mx-2 mb-3" onClick={() => {
                                                        setEditData({ ...data, _id: task._id });
                                                        setEdit(true); // Call handleChange separately if needed
                                                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: "In Progress" });
                                                        setid(task._id);
                                                    }}>Edit</button>
                                                    <button className="btn btn-danger mx-2 mb-3" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</button>
                                                    <button className='btn btn-primary mx-2 mb-3' onClick={() => { setShowSubTask(!ShowSubTask); setid(task._id) }}>
                                                        {ShowSubTask ? "Close Subtasks" : "Show Subtasks"}
                                                    </button>
                                                </div>
                                            </div>
                                            <div></div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                </div>
            </div>
            <EditTask
                edit={edit}
                toggleModal={toggleModal}
                editData={editData}
                setEditData={setEditData}
                _id={id}
            />
            {askDelete && (
                <Modal show={askDelete} onHide={toggleDeleteModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this task?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={toggleDeleteModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            {createTask && (
                <Modal show={createTask} onHide={toggleCreateTaskModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Form for creating task */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="newTaskTitle" className="form-label">Task Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newTaskTitle"
                                    name='task'
                                    value={data.task}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    name='enddate'
                                    value={data.enddate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="priority" className="form-label">Priority</label>
                                <select
                                    className="form-select"
                                    id="priority"
                                    name='priority'
                                    value={data.priority}
                                    onChange={handleChange}
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            {/* Add more fields as needed */}
                            <Button variant="primary" type="submit">Create Task</Button>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={toggleCreateTaskModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
            <AddSubTaskModal addSubTask={addSubTask} onClose={() => toggleAddSubTaskModal()} _id={id} />
            {viewTask && (
                <Modal show={viewTask} onHide={toggleViewTask} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>View Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Display task details */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={toggleViewTask}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
